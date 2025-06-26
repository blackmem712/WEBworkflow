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
]