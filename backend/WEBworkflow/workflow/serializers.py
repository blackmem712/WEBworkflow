from rest_framework import serializers
from .models import Pessoa

class PessoaSerializer(serializers.ModelSerializer):
 class Meta:
    model = Pessoa
    fields =[
      'id','nome','cpf','email','cep','rua','numero','bairro','cidade','estado' ,'telefone'
    ]
     
