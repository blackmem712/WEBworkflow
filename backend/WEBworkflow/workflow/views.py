from django.shortcuts import render
from django.http import HttpResponse
from django.urls import path
from rest_framework.decorators import api_view
from rest_framework.response import Response



from .serializers import PessoaSerializer
from .models import Pessoa

def home(request):
    return render(request, 'workflow/pages/cad_equip.html')

@api_view()
def workflow_list(request):
    pessoas = Pessoa.objects.all()
    serializer = PessoaSerializer(instance = pessoas,many=True)
    return Response(serializer.data)