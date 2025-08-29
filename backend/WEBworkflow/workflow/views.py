# workflow/views.py

from django.shortcuts import render
from django.http import HttpResponse
from django.urls import path
from django.utils import timezone
from django.db import transaction

from rest_framework import status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.throttling import ScopedRateThrottle
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import Group
from django.utils.crypto import get_random_string

from django_filters.rest_framework import DjangoFilterBackend

from .serializers import (
    ClienteSerializer, EquipamentoSerializer, FuncionarioSerializer,
    CargoSerializer, SetorSerializer, ServicoSerializer, ProdutoSerializer,
    FornecedorSerializer, OrcamentoSerializer
)
from .models import (
    Cliente, Equipamento, Status, Historico, Funcionario,
    Cargo, Setor, Servico, Produto, Fornecedor, Orcamento
)

# ------------------------------------------------------------
# RBAC e QR helpers
# ------------------------------------------------------------
ROLE_NAME = {
    'TC': 'Tecnico',
    'GE': 'Gerente',
    'RC': 'Recepcao',
}

TRANSITIONS = {
    'OR': {'MA': {'roles': ['TC', 'GE']}},
    'MA': {'GA': {'roles': ['TC', 'GE']}},
    'GA': {'SA': {'roles': ['RC', 'GE']}},
}

def user_has_any_role(user, short_codes):
    if user.is_superuser:
        return True
    names = [ROLE_NAME[c] for c in short_codes]
    return user.groups.filter(name__in=names).exists()

class QRThrottle(ScopedRateThrottle):
    scope = 'qr'


# ------------------------------------------------------------
# Views simples
# ------------------------------------------------------------
def home(request):
    return render(request, 'workflow/pages/cad_equip.html')


@api_view()
def workflow_list(request):
    clientes = Cliente.objects.all()
    serializer = ClienteSerializer(instance=clientes, many=True)
    return Response(serializer.data)


# ------------------------------------------------------------
# Helper central para transição de status
# ------------------------------------------------------------
def registrar_status(equipamento: Equipamento, novo_status: str, user=None, source='web') -> Status:
    """
    Fecha o status anterior (date_saida) e cria um novo registro em Status,
    apontando Historico.status_id para o 'vigente'.
    Idempotente: se o último já é 'novo_status' e está aberto, apenas devolve.
    """
    if novo_status not in {'EN', 'OR', 'MA', 'GA', 'SA'}:
        raise ValueError('Status inválido')

    historico = equipamento.historico_id
    if not historico:
        historico = Historico.objects.create()
        equipamento.historico_id = historico
        equipamento.save(update_fields=['historico_id'])

    ultimo = historico.statuses.order_by('-date_entrada', '-id').first()

    # Idempotência: mesmo status e ainda aberto -> não duplica
    if ultimo and ultimo.status == novo_status and ultimo.date_saida is None:
        # assegura que historico aponta para o vigente
        if historico.status_id_id != ultimo.id:
            historico.status_id = ultimo
            historico.save(update_fields=['status_id'])
        # complementa auditoria se faltar
        changed = False
        try:
            # campos só existem após a migração; por isso getattr/hasattr defensivo
            if user and getattr(ultimo, 'created_by_id', None) in (None, 0):
                ultimo.created_by = user
                changed = True
            if source and getattr(ultimo, 'source', None) != source:
                ultimo.source = source
                changed = True
        except Exception:
            pass
        if changed:
            ultimo.save(update_fields=[fld for fld in ['created_by', 'source'] if hasattr(ultimo, fld)])
        return ultimo

    # Fecha o último status aberto
    if ultimo and ultimo.date_saida is None:
        ultimo.date_saida = timezone.now()
        ultimo.save(update_fields=['date_saida'])

    # Cria o novo status (com auditoria defensiva para compatibilidade com modelos antigos)
    novo = Status.objects.create(
        historico=historico,
        status=novo_status,
        date_entrada=timezone.now(),
        date_saida=None,
    )

    # tenta auditar se o modelo já possuir os campos
    try:
        if user is not None and hasattr(novo, 'created_by'):
            novo.created_by = user
        if hasattr(novo, 'source'):
            novo.source = source
        if hasattr(novo, 'created_by') or hasattr(novo, 'source'):
            novo.save(update_fields=[fld for fld in ['created_by','source'] if hasattr(novo, fld)])
    except Exception:
        pass

    # Atualiza o ponteiro do vigente
    historico.status_id = novo
    historico.save(update_fields=['status_id'])
    return novo


# ------------------------------------------------------------
# Clientes
# ------------------------------------------------------------
class WorkflowPessoaAPIv1ViewSet(ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
    http_method_names = ['get', 'options', 'head', 'patch', 'post', 'delete']

    def partial_update(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        cliente = self.get_queryset().filter(pk=pk).first()
        serializer = ClienteSerializer(
            instance=cliente,
            data=request.data,
            many=False,
            context={'request': request},
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def get_queryset(self):
        qs = super().get_queryset()
        query_params = self.request.query_params
        for key, value in query_params.items():
            qs = qs.filter(**{key: value})
        return qs


# ------------------------------------------------------------
# Equipamentos
# ------------------------------------------------------------
class WorkflowEquipamentoAPIv1ViewSet(ModelViewSet):
    queryset = Equipamento.objects.all()
    serializer_class = EquipamentoSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['cliente']
    http_method_names = ['get', 'options', 'head', 'patch', 'post', 'delete']

    def create(self, request, *args, **kwargs):
        """
        Cria equipamento e inicia histórico EN (Entrada) se ainda não existir.
        """
        serializer = EquipamentoSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            equipamento = serializer.save()
            # Garante histórico e status EN inicial
            if not equipamento.historico_id:
                historico = Historico.objects.create()
                equipamento.historico_id = historico
                equipamento.save(update_fields=['historico_id'])
            # Registra EN como status inicial (vigente)
            registrar_status(equipamento, 'EN', user=(request.user if request.user.is_authenticated else None), source='web')

        # Retorna o equipamento já com status vigente
        return Response(EquipamentoSerializer(equipamento).data, status=status.HTTP_201_CREATED)

    def partial_update(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        equipamento = self.get_queryset().filter(pk=pk).first()
        novo_status = request.data.get('novo_status')

        serializer = EquipamentoSerializer(
            instance=equipamento,
            data=request.data,
            many=False,
            context={'request': request},
            partial=True
        )
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            equipamento = serializer.save()
            if novo_status:
                try:
                    registrar_status(equipamento, str(novo_status), user=(request.user if request.user.is_authenticated else None), source='web')
                except ValueError as e:
                    return Response({'detail': str(e)}, status=400)

        equipamento.refresh_from_db()
        return Response(EquipamentoSerializer(equipamento).data)

    def get_queryset(self):
        qs = super().get_queryset()
        query_params = self.request.query_params
        for key, value in query_params.items():
            qs = qs.filter(**{key: value})
        return qs

    @action(detail=True, methods=['get'])
    def historico(self, request, pk=None):
        """
        Histórico completo de status do equipamento (ordem cronológica).
        GET /equipamentos/api/v1/<id>/historico/
        """
        equipamento = self.get_queryset().filter(pk=pk).first()
        if not equipamento or not equipamento.historico_id:
            return Response([], status=200)
        statuses = equipamento.historico_id.statuses.order_by('date_entrada', 'id')
        data = [
            {
                'id': s.id,
                'status': s.status,
                'date_entrada': s.date_entrada,
                'date_saida': s.date_saida,
            }
            for s in statuses
        ]
        return Response(data)


# ------------------------------------------------------------
# Cargos / Setores
# ------------------------------------------------------------
class WorkflowCargoAPIv1ViewSet(ModelViewSet):
    queryset = Cargo.objects.all()
    serializer_class = CargoSerializer
    http_method_names = ['get', 'options', 'head']


class WorkflowSetorAPIv1ViewSet(ModelViewSet):
    queryset = Setor.objects.all()
    serializer_class = SetorSerializer
    http_method_names = ['get', 'options', 'head']


# ------------------------------------------------------------
# Serviços / Produtos / Fornecedores
# ------------------------------------------------------------
class WorkflowServicoAPIv1ViewSet(ModelViewSet):
    queryset = Servico.objects.all()
    serializer_class = ServicoSerializer
    http_method_names = ['get', 'post', 'patch', 'delete', 'options', 'head']


class WorkflowProdutoAPIv1ViewSet(ModelViewSet):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer
    http_method_names = ['get', 'post', 'patch', 'delete', 'options', 'head']


class WorkflowFornecedorAPIv1ViewSet(ModelViewSet):
    queryset = Fornecedor.objects.all()
    serializer_class = FornecedorSerializer
    http_method_names = ['get', 'post', 'patch', 'delete', 'options', 'head']


# ------------------------------------------------------------
# Funcionários
# ------------------------------------------------------------
class WorkflowFuncionarioAPIv1ViewSet(ModelViewSet):
    queryset = Funcionario.objects.all()
    serializer_class = FuncionarioSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['cpf', 'nome']
    http_method_names = ['get', 'post', 'patch', 'delete', 'options', 'head']


# ------------------------------------------------------------
# Orçamentos
# ------------------------------------------------------------
class WorkflowOrcamentoAPIv1ViewSet(ModelViewSet):
    queryset = Orcamento.objects.all()
    serializer_class = OrcamentoSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['equipamento', 'cargo_funcionario']
    http_method_names = ['get', 'post', 'patch', 'delete', 'options', 'head']

    def create(self, request, *args, **kwargs):
        """
        Cria o orçamento e registra OR (Orçamento) no histórico do equipamento.
        """
        serializer = OrcamentoSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            orcamento = serializer.save()
            registrar_status(orcamento.equipamento, 'OR', user=(request.user if request.user.is_authenticated else None), source='web')

        return Response(OrcamentoSerializer(orcamento).data, status=status.HTTP_201_CREATED)


# ------------------------------------------------------------
# Endpoints de QR (GET público, POST protegido)
# ------------------------------------------------------------
from rest_framework.decorators import permission_classes, throttle_classes

@api_view(['GET'])
@permission_classes([AllowAny])
@throttle_classes([QRThrottle])
def qr_get(request, slug: str):
    eq = get_object_or_404(Equipamento, qr_slug=slug)
    vigente = eq.historico_id.status_id if getattr(eq, 'historico_id', None) else None
    status_code = vigente.status if vigente else None
    status_label = dict(Status._meta.get_field('status').choices).get(status_code) if status_code else None
    return Response({
        'equipamento_id': eq.id,
        'equipamento': getattr(eq, 'equipamento', None),
        'status': status_code,
        'status_label': status_label,
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@throttle_classes([QRThrottle])
def qr_post(request, slug: str):
    eq = get_object_or_404(Equipamento, qr_slug=slug)
    vigente = eq.historico_id.status_id if getattr(eq, 'historico_id', None) else None
    if not vigente:
        return Response({'detail': 'Equipamento sem histórico/status vigente.'}, status=400)

    current = vigente.status
    rules = TRANSITIONS.get(current)
    if not rules or len(rules) != 1:
        return Response({'detail': 'Sem transição automática a partir deste status.'}, status=400)

    next_code = next(iter(rules.keys()))
    need_roles = rules[next_code]['roles']

    if not user_has_any_role(request.user, need_roles):
        return Response({'detail': 'Permissão negada para esta transição.'}, status=403)

    registrar_status(eq, next_code, user=request.user, source='qr')
    return Response({'ok': True, 'from': current, 'to': next_code})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@throttle_classes([QRThrottle])
def qr_rotate(request, slug: str):
    # somente gerente pode rotacionar
    if not user_has_any_role(request.user, ['GE']):
        return Response({'detail': 'Apenas gerente pode rotacionar QR.'}, status=403)

    eq = get_object_or_404(Equipamento, qr_slug=slug)
    # gira até achar slug livre
    for _ in range(5):
        new_slug = get_random_string(12)
        if not Equipamento.objects.filter(qr_slug=new_slug).exists():
            eq.qr_slug = new_slug
            eq.save(update_fields=['qr_slug'])
            return Response({'ok': True, 'new_slug': new_slug})
    return Response({'detail': 'Falha ao rotacionar slug.'}, status=500)
