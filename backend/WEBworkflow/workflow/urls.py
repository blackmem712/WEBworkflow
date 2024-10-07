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
    
]