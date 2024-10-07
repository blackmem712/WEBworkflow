from rest_framework import serializers
from .models import Cliente, Equipamento

class ClienteSerializer(serializers.ModelSerializer):
 class Meta:
    model = Cliente
    fields = '__all__' 
     
class EquipamentoSerializer(serializers.ModelSerializer):
  class Meta:
    model = Equipamento
    fields = '__all__'