from django.shortcuts import render
from django.http import HttpResponse
from django.urls import path
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from .serializers import ClienteSerializer
from .models import Cliente

def home(request):
    return render(request, 'workflow/pages/cad_equip.html')


class WorkflowAPIv1ViewSet(ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
    http_method_names = ['get', 'options', 'head', 'patch', 'post', 'delete']
      

    def partial_update(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        pessoa = self.get_queryset().filter(pk=pk).first()
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

