# workflow/views.py

from django.shortcuts import render, get_object_or_404
from django.utils import timezone
from django.db import transaction
from django.utils.crypto import get_random_string
from django.utils.timezone import is_naive, make_naive

from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.decorators import api_view, permission_classes, throttle_classes, action
from django.contrib.auth.models import Group
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
        if getattr(historico, 'status_id_id', None) != ultimo.id:
            historico.status_id = ultimo
            historico.save(update_fields=['status_id'])
        # complementa auditoria se faltar
        changed = False
        try:
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

    # Cria o novo status (com auditoria defensiva)
    novo = Status.objects.create(
        historico=historico,
        status=novo_status,
        date_entrada=timezone.now(),
        date_saida=None,
    )

    try:
        if user is not None and hasattr(novo, 'created_by'):
            novo.created_by = user
        if hasattr(novo, 'source'):
            novo.source = source
        if hasattr(novo, 'created_by') or hasattr(novo, 'source'):
            novo.save(update_fields=[fld for fld in ['created_by', 'source'] if hasattr(novo, fld)])
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
            registrar_status(
                equipamento,
                'EN',
                user=(request.user if request.user.is_authenticated else None),
                source='web'
            )

        # Retorna o equipamento já com status vigente
        return Response(EquipamentoSerializer(equipamento).data, status=status.HTTP_201_CREATED)

    def partial_update(self, request, *args, **kwargs):
        """
        PATCH /equipamentos/api/v1/<id>/
        Aceita campos normais do equipamento e, opcionalmente, "novo_status" (EN|OR|MA|GA|SA).
        Quando "novo_status" vier, REGISTRA a transição no histórico (registrar_status)
        e garante que o ponteiro historico_id.status_id aponte para o vigente.
        """
        pk = kwargs.get('pk')
        equipamento = self.get_queryset().filter(pk=pk).first()
        if not equipamento:
            return Response({'detail': 'Equipamento não encontrado.'}, status=404)

        # ⚠️ Remover "novo_status" do payload antes de validar no serializer
        data = request.data.copy()
        novo_status = data.pop('novo_status', None)

        serializer = EquipamentoSerializer(
            instance=equipamento,
            data=data,
            many=False,
            context={'request': request},
            partial=True
        )
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            equipamento = serializer.save()

            if novo_status:
                code = str(novo_status).strip().upper()
                if code not in {'EN', 'OR', 'MA', 'GA', 'SA'}:
                    return Response({'detail': 'Status inválido.'}, status=400)
                try:
                    registrar_status(
                        equipamento,
                        code,
                        user=(request.user if request.user.is_authenticated else None),
                        source='web'
                    )
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

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def set_status(self, request, pk=None):
        """
        POST /equipamentos/api/v1/<id>/set_status/
        body: { "status": "MA" }
        Alternativa explícita ao PATCH com "novo_status".
        """
        equipamento = self.get_queryset().filter(pk=pk).first()
        if not equipamento:
            return Response({'detail': 'Equipamento não encontrado.'}, status=404)

        status_code = str(request.data.get('status', '')).strip().upper()
        if status_code not in {'EN', 'OR', 'MA', 'GA', 'SA'}:
            return Response({'detail': 'Status inválido.'}, status=400)

        with transaction.atomic():
            registrar_status(
                equipamento,
                status_code,
                user=(request.user if request.user.is_authenticated else None),
                source='web'
            )

        equipamento.refresh_from_db()
        return Response(EquipamentoSerializer(equipamento).data)


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
            registrar_status(
                orcamento.equipamento,
                'OR',
                user=(request.user if request.user.is_authenticated else None),
                source='web'
            )

        return Response(OrcamentoSerializer(orcamento).data, status=status.HTTP_201_CREATED)


# ------------------------------------------------------------
# Endpoints de QR (GET público, POST protegido)
# ------------------------------------------------------------
@api_view(['GET'])
@permission_classes([AllowAny])
@throttle_classes([QRThrottle])
def qr_get(request, slug: str):
    """
    QR público (somente leitura) — sempre reflete o status VIGENTE:
    1) tenta historico_id.status_id (objeto ou PK)
    2) se faltar, pega status aberto (date_saida IS NULL)
    3) se ainda faltar, pega o último por data e id
    """
    from .models import Equipamento, Historico, Status, Orcamento

    eq = get_object_or_404(Equipamento, qr_slug=slug)

    # --- histórico do equipamento (seu FK chama "historico_id" e é um OBJETO) ---
    hist = getattr(eq, 'historico_id', None)
    if hist is None or isinstance(hist, int):
        # se por acaso vier um int (pk), resolve o objeto
        hist = (
            Historico.objects.filter(pk=hist if isinstance(hist, int) else None, equipamento=eq).first()
            or Historico.objects.filter(equipamento=eq).order_by('-id').first()
        )

    vigente = None
    vigente_pk = None
    ultimo = None

    if hist is not None:
        # 1) ponteiro vigente (no seu modelo o campo se chama "status_id" MESMO sendo um FK)
        raw = getattr(hist, 'status_id', None)  # pode vir objeto ou pk
        if raw is not None:
            if hasattr(raw, 'status'):
                vigente = raw
                vigente_pk = getattr(raw, 'pk', None)
            else:
                vigente_pk = raw
                vigente = Status.objects.filter(pk=raw).first()

        # 2) se o ponteiro faltar ou estiver inconsistente, tenta o status ABERTO
        if not vigente:
            try:
                vigente = hist.statuses.filter(date_saida__isnull=True).order_by('-date_entrada', '-id').first()
            except Exception:
                vigente = None

        # 3) se ainda não houver, usa o ÚLTIMO do histórico
        if not vigente:
            try:
                ultimo = hist.statuses.order_by('-date_entrada', '-id').first()
            except Exception:
                ultimo = None

    use_status = vigente or ultimo
    status_code = getattr(use_status, 'status', None) or 'EN'
    try:
        status_label = dict(Status._meta.get_field('status').choices).get(status_code, 'Recepção')
    except Exception:
        status_label = None

    # date_entrada do status usado
    dt = getattr(use_status, 'date_entrada', None)
    if dt is not None and is_naive(dt):
        try:
            dt = make_naive(dt)
        except Exception:
            pass
    date_entrada_iso = dt.isoformat() if dt else None

    # Orçamento mais recente (para OR/MA/GA renderizarem técnico/itens)
    orc = Orcamento.objects.filter(equipamento=eq).order_by('-id').first()
    orcamento_payload = None
    if orc:
        # técnico via cargo_funcionario -> funcionario (serializado)
        tecnico = None
        try:
            cf = getattr(orc, 'cargo_funcionario', None)
            func = getattr(cf, 'funcionario', None) if cf else None
            cargo_obj = getattr(cf, 'cargo', None) if cf else None
            cargo_code = None
            cargo_label = None
            if cargo_obj is not None:
                cargo_code = (
                    getattr(cargo_obj, 'cargo', None)
                    or getattr(cargo_obj, 'sigla', None)
                    or getattr(cargo_obj, 'codigo', None)
                    or getattr(cargo_obj, 'id', None)
                )
                cargo_label = (
                    getattr(cargo_obj, 'nome', None)
                    or getattr(cargo_obj, 'descricao', None)
                    or getattr(cargo_obj, 'label', None)
                )
            tecnico = {
                'id': getattr(cf, 'id', None),
                'nome': getattr(func, 'nome', None),
                'cargo': cargo_code,
                'cargo_label': cargo_label,
            }
        except Exception:
            tecnico = None

        try:
            servicos = [{'id': s.id, 'nome': s.nome, 'valor': getattr(s, 'valor', None)} for s in orc.servico.all()]
        except Exception:
            servicos = []

        try:
            produtos = [{'id': p.id, 'nome': p.nome, 'preco': getattr(p, 'preco', None)} for p in orc.produto.all()]
        except Exception:
            produtos = []

        orcamento_payload = {
            'id': orc.id,
            'tecnico': tecnico,
            'servicos': servicos,
            'produtos': produtos,
        }

    payload = {
        'equipamento_id': eq.id,
        'equipamento': getattr(eq, 'equipamento', None),
        'cliente_nome': getattr(getattr(eq, 'cliente', None), 'nome', None),
        'status': status_code,          # EN | OR | MA | GA | SA
        'status_label': status_label,
        'date_entrada': date_entrada_iso,
        'orcamento': orcamento_payload,
    }

    resp = Response(payload)
    # headers de debug (olhe em Network > Headers na chamada /q/<slug>/)
    if vigente_pk:
        resp['X-Debug-Vigente-PK'] = str(vigente_pk)
    if vigente:
        resp['X-Debug-Vigente-Code'] = getattr(vigente, 'status', '') or ''
    if ultimo:
        resp['X-Debug-Ultimo-Code'] = getattr(ultimo, 'status', '') or ''
    resp['X-Robots-Tag'] = 'noindex, nofollow'
    return resp


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
