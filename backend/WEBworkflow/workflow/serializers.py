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
    
def create(self, validated_data):
        # Removendo o 'historico' dos dados validados, pois ele será tratado separadamente
        historico_data = validated_data.pop('historico_id', None)

        # Criando o equipamento com os dados restantes
        equipamento = Equipamento.objects.create(**validated_data)

        # Associando o histórico criado anteriormente, se existir
        if historico_data:
            equipamento.historico = historico_data
            equipamento.save()

        return equipamento
