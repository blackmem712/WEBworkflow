from rest_framework import serializers

class PessoaSerializer(serializers.Serializer):

    id= serializers.IntegerField()
    nome = serializers.CharField(max_length=200) 
    cpf = serializers.CharField(max_length=12) 
    email = serializers.EmailField(max_length=50)
    endereco = serializers.CharField(max_length=50)
    cidade = serializers.CharField(max_length=12)
    telefone = serializers.CharField(max_length=50) 
