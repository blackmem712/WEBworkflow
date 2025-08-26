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
def registrar_status(equipamento: Equipamento, novo_status: str) -> Status:
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
        if historico.status_id_id != ultimo.id:
            historico.status_id = ultimo
            historico.save(update_fields=['status_id'])
        return ultimo

    # Fecha o último status aberto
    if ultimo and ultimo.date_saida is None:
        ultimo.date_saida = timezone.now()
        ultimo.save(update_fields=['date_saida'])

    # Cria o novo status
    novo = Status.objects.create(
        historico=historico,
        status=novo_status,
        date_entrada=timezone.now(),
        date_saida=None,
    )

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
        Cria o equipamento + histórico e registra EN (Entrada) como status inicial.
        """
        with transaction.atomic():
            # Cria histórico vazio
            historico_obj = Historico.objects.create()

            # Valida e cria o equipamento atrelando o histórico
            serializer = EquipamentoSerializer(
                data=request.data,
                context={'request': request},
            )
            serializer.is_valid(raise_exception=True)
            equipamento = serializer.save(historico_id=historico_obj)

            # Registra EN como status inicial (vigente)
            registrar_status(equipamento, 'EN')

        # Retorna o equipamento já com status vigente
        return Response(EquipamentoSerializer(equipamento).data, status=status.HTTP_201_CREATED)

    def partial_update(self, request, *args, **kwargs):
        """
        Atualiza campos do equipamento.
        Se vier 'status' no payload, registra a transição de status.
        """
        pk = kwargs.get('pk')
        equipamento = self.get_queryset().filter(pk=pk).first()
        if not equipamento:
            return Response({'detail': 'Equipamento não encontrado.'}, status=404)

        # Separa 'status' do restante do payload
        incoming = request.data.copy()
        novo_status = incoming.pop('status', None)

        serializer = EquipamentoSerializer(
            equipamento,
            data=incoming,
            many=False,
            context={'request': request},
            partial=True
        )
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            equipamento = serializer.save()
            if novo_status:
                try:
                    registrar_status(equipamento, str(novo_status))
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
        equipamento = self.get_object()
        historico = equipamento.historico_id
        if not historico:
            return Response([], status=200)
        qs = historico.statuses.order_by('date_entrada', 'id')
        data = [
            {
                'status': s.status,
                'date_entrada': s.date_entrada,
                'date_saida': s.date_saida,
            }
            for s in qs
        ]
        return Response(data, status=200)


# ------------------------------------------------------------
# Funcionários / Cargo / Setor
# ------------------------------------------------------------
class WorkflowFuncionarioAPIv1ViewSet(ModelViewSet):
    queryset = Funcionario.objects.all()
    serializer_class = FuncionarioSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['cpf', 'nome']
    http_method_names = ['get', 'post', 'patch', 'delete', 'options', 'head']


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
            registrar_status(orcamento.equipamento, 'OR')

        return Response(OrcamentoSerializer(orcamento).data, status=status.HTTP_201_CREATED)
