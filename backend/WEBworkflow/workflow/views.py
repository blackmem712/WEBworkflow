from django.shortcuts import render
from django.http import HttpResponse
from django.urls import path
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from .serializers import ClienteSerializer, EquipamentoSerializer
from .models import Cliente, Equipamento

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
   http_method_names = ['get','options','head','patch','post','delete']
   
   def partial_update(self, request, *args, **kwargs):
       pk = kwargs.get('pk')
       equipamento = self.get_queryset().filter(pk=pk).first()
       serializer = EquipamentoSerializer(
        isinstance = equipamento,
        data= request.data,
        many=False,
        context= {'request': request},
        partial= True,
       )

       print('query Strings',self.request.query_params)
       serializer.is_valid(raise_excepition=True)
       serializer.save()

       return Response(
         serializer.data,
      )
    
   def get_queryset(self):
       qs = super().get_queryset()
       query_params = self.request.query_params

       for key,value in query_params.itens():
           qs =qs.filter(**{key:value})

           print('parametros',self.kwargs)
           print('query Strings',self.request.query_params)

       return qs
           
       
          