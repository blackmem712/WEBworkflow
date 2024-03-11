from django.shortcuts import render
from django.http import HttpResponse
from django.urls import path
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet


from .serializers import PessoaSerializer
from .models import Pessoa

def home(request):
    return render(request, 'workflow/pages/cad_equip.html')


class WorkflowAPIv1ViewSet(ModelViewSet):
    queryset = Pessoa.objects.all()
    serializer_class = PessoaSerializer

def partial_update(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        pessoa = self.get_queryset().filter(pk=pk).first()
        serializer = PessoaSerializer(
            instance=pessoa,
            data=request.data,
            many=False,
            context={'request': request},
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            serializer.data,
        )

@api_view()
def workflow_list(request):
    pessoas = Pessoa.objects.all()
    serializer = PessoaSerializer(instance = pessoas,many=True)
    return Response(serializer.data)