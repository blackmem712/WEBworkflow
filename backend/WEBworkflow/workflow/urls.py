from django.contrib import admin
from django.urls import path
from.import views


urlpatterns = [
    path('', views.home),

    path(
        'workflow/',
        views.workflow_list,
        name='workflow_api'

    ),
    
    path(
      'pessoas/api/v1/',
      views.WorkflowPessoaAPIv1ViewSet.as_view({
        'get': 'list',
        'post':'create'

      }),
      name='pessoas_api_v1'
    ),

    path(
      'pessoas/api/v1/<int:pk>/',
      views.WorkflowPessoaAPIv1ViewSet.as_view({
        'get':'retrieve',
        'patch':'partial_update',
        'delete': 'destroy',
        
      }),
      name='pessoas_api_v1_detail',
    ),

    path(
      'equipamentos/api/v1/',
      views.WorkflowEquipamentoAPIv1ViewSet.as_view({
        'get': 'list',
        'post':'create'

      }),
      name='equipamentos_api_v1'
    ),

    path(
      'equipamentos/api/v1/<int:pk>/',
      views.WorkflowEquipamentoAPIv1ViewSet.as_view({
        'get':'retrieve',
        'patch':'partial_update',
        'delete': 'destroy',
        
      }),
      name='equipamentos_api_v1_detail',
    ),
    path(
      'equipamentos/api/v1/<int:pk>/historico/',
      views.WorkflowEquipamentoAPIv1ViewSet.as_view({'get': 'historico'}),
      name='equipamentos_api_v1_historico',
    ),
    path(
      'funcionarios/api/v1/',
      views.WorkflowFuncionarioAPIv1ViewSet.as_view({
        'get':  'list',
        'post': 'create'
      }),
      name='funcionarios_api_v1'
    ),
    path(
      'funcionarios/api/v1/<int:pk>/',
      views.WorkflowFuncionarioAPIv1ViewSet.as_view({
        'get':    'retrieve',
        'patch':  'partial_update',
        'delete': 'destroy'
      }),
      name='funcionarios_api_v1_detail'
    ),
     # Cargos (só leitura, pra popular select)
    path(
      'cargos/api/v1/',
      views.WorkflowCargoAPIv1ViewSet.as_view({'get':'list'}),
      name='cargos_list'
    ),
    path(
      'cargos/api/v1/<int:pk>/',
      views.WorkflowCargoAPIv1ViewSet.as_view({'get':'retrieve'}),
      name='cargos_detail'
    ),

    # Setores (só leitura, pra popular select)
    path(
      'setores/api/v1/',
      views.WorkflowSetorAPIv1ViewSet.as_view({'get':'list'}),
      name='setores_list'
    ),
    path(
      'setores/api/v1/<int:pk>/',
      views.WorkflowSetorAPIv1ViewSet.as_view({'get':'retrieve'}),
      name='setores_detail'
    ),
    path(
      'servicos/api/v1/',
      views.WorkflowServicoAPIv1ViewSet.as_view({
        'get':  'list',
        'post': 'create'
      }),
      name='servicos_api_v1'
    ),
    # Recupera, atualiza parcialmente e deleta um Serviço
    path(
      'servicos/api/v1/<int:pk>/',
      views.WorkflowServicoAPIv1ViewSet.as_view({
        'get':    'retrieve',
        'patch':  'partial_update',
        'delete': 'destroy'
      }),
      name='servicos_api_v1_detail'
    ),
    path(
      'produtos/api/v1/',
      views.WorkflowProdutoAPIv1ViewSet.as_view({
        'get':  'list',
        'post': 'create'
      }),
      name='produtos_api_v1'
    ),
    # Recupera, atualiza parcialmente e deleta um Produto
    path(
      'produtos/api/v1/<int:pk>/',
      views.WorkflowProdutoAPIv1ViewSet.as_view({
        'get':    'retrieve',
        'patch':  'partial_update',
        'delete': 'destroy'
      }),
      name='produtos_api_v1_detail'
    ),
    path(
      'fornecedores/api/v1/',
      views.WorkflowFornecedorAPIv1ViewSet.as_view({
        'get':  'list',
        'post': 'create'
      }),
      name='fornecedores_api_v1'
    ),
    # Recupera, atualiza parcialmente e deleta um Fornecedor
    path(
      'fornecedores/api/v1/<int:pk>/',
      views.WorkflowFornecedorAPIv1ViewSet.as_view({
        'get':    'retrieve',
        'patch':  'partial_update',
        'delete': 'destroy'
      }),
      name='fornecedores_api_v1_detail'
    ),
     path(
      'orcamentos/api/v1/',
      views.WorkflowOrcamentoAPIv1ViewSet.as_view({
        'get':  'list',
        'post': 'create'
      }),
      name='orcamentos_api_v1'
    ),
    # Recuperar, atualizar parcialmente e deletar
    path(
      'orcamentos/api/v1/<int:pk>/',
      views.WorkflowOrcamentoAPIv1ViewSet.as_view({
        'get':    'retrieve',
        'patch':  'partial_update',
        'delete': 'destroy'
      }),
      name='orcamentos_api_v1_detail'
    ),
]