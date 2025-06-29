from django.shortcuts import render
from django.http import HttpResponse
from django.urls import path
from rest_framework import status 
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from .serializers import ClienteSerializer, EquipamentoSerializer, FuncionarioSerializer,CargoSerializer, SetorSerializer, ServicoSerializer, ProdutoSerializer, FornecedorSerializer, OrcamentoSerializer
from .models import Cliente, Equipamento, Status, Historico, Funcionario,Cargo,Setor, Servico, Produto, Fornecedor, Orcamento
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend


def home(request):
    return render(request, 'workflow/pages/cad_equip.html')


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
                       
        print('query Strings',self.request.query_params)
        serializer.is_valid(raise_exception=True)
        serializer.save()
  
        return Response(
            serializer.data,
        )
        
    def get_queryset(self):
     
     qs = super().get_queryset()
     query_params = self.request.query_params
     
     for key, value in query_params.items():
        
        qs = qs.filter(**{key: value})


     print('parametros',self.kwargs)
     print('query Strings',self.request.query_params)

     return qs
   
@api_view()
def workflow_list(request):
    clientes = Cliente.objects.all()
    serializer = ClienteSerializer(instance = clientes,many=True)
    return Response(serializer.data)


class WorkflowEquipamentoAPIv1ViewSet(ModelViewSet):
   queryset = Equipamento.objects.all()
   serializer_class = EquipamentoSerializer
   filter_backends = [DjangoFilterBackend]  
   filterset_fields = ['cliente']  
   http_method_names = ['get', 'options', 'head', 'patch', 'post', 'delete']


   # Sobrescrevendo o método 'create' para quando um novo Equipamento for cadastrado
   def create(self, request, *args, **kwargs):
        # Cria um novo status com "Entrada" e data de entrada como a data atual
        status_obj = Status.objects.create(
            date_entrada=timezone.now(),  
            status='EN' 
        )
        
        # Cria um novo histórico associado ao status criado
        historico_obj = Historico.objects.create(status_id=status_obj)

        
        serializer = EquipamentoSerializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        
        serializer.save(historico_id=historico_obj)

        # Retorna a resposta com os dados do equipamento criado
        return Response(serializer.data, status=status.HTTP_201_CREATED)


   # Método para 'PATCH' ou atualização parcial
   def partial_update(self, request, *args, **kwargs):
       pk = kwargs.get('pk')
       equipamento = self.get_queryset().filter(pk=pk).first()

       # Serializando o objeto com atualização parcial
       serializer = EquipamentoSerializer(
           equipamento,  # Objeto de Equipamento
           data=request.data,
           many=False,
           context={'request': request},
           partial=True  # Atualização parcial
       )

       print('Query Strings:', self.request.query_params)

       # Validação do serializer
       serializer.is_valid(raise_exception=True)

       
       serializer.save()

       return Response(serializer.data)

   

   # Sobrescrevendo o método get_queryset para filtrar por query params
   def get_queryset(self):
       qs = super().get_queryset()
       query_params = self.request.query_params

       # Iterando sobre os parâmetros de consulta e aplicando filtros
       for key, value in query_params.items():
           qs = qs.filter(**{key: value})

       print('Parâmetros:', self.kwargs)
       print('Query Strings:', self.request.query_params)

       return qs

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

class WorkflowOrcamentoAPIv1ViewSet(ModelViewSet):
    queryset = Orcamento.objects.all()
    serializer_class = OrcamentoSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['equipamento', 'cargo_funcionario']
    http_method_names = ['get', 'post', 'patch', 'delete', 'options', 'head']