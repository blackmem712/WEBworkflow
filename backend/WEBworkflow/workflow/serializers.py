from rest_framework import serializers
from .models import Cliente, Equipamento, Historico, Status,Funcionario,Cargo_funcionario,Cargo,Setor

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'


class StatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Status
        fields = ['status', 'date_entrada', 'date_saida']


class EquipamentoSerializer(serializers.ModelSerializer):
    # Campo virtual que expõe o objeto Status aninhado
    status = serializers.SerializerMethodField()

    class Meta:
        model = Equipamento
        fields = [
            'id',
            'equipamento',
            'marca',
            'modelo',
            'cor',
            'nun_serie',
            'cliente',
            # mantém o historico_id para input via PK
            'historico_id',
            # expõe o status desejado
            'status',
        ]

    def get_status(self, obj):
        """
        Retorna o Status associado ao Historico (OneToOneField historico_id).
        """
        historico = obj.historico_id
        if not historico or not historico.status_id:
            return None
        return StatusSerializer(historico.status_id).data

    def create(self, validated_data):
        # Extrai a instância de Historico (se veio no payload)
        historico_obj = validated_data.pop('historico_id', None)
        # Cria o equipamento com os demais campos
        equipamento = super().create(validated_data)
        # Associa o Historico existente ao equipamento
        if historico_obj:
            equipamento.historico_id = historico_obj
            equipamento.save()
        return equipamento
      
class CargoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cargo
        fields = ['id', 'cargo']  # id + código (RC, TC, GE)

class SetorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Setor
        fields = ['id', 'setor']  # id + código (RE, OF, ES)

class FuncionarioSerializer(serializers.ModelSerializer):
    cargo = serializers.PrimaryKeyRelatedField(
        queryset=Cargo.objects.all(),
        write_only=True,
        help_text="ID do Cargo"
    )
    setor = serializers.PrimaryKeyRelatedField(
        queryset=Setor.objects.all(),
        write_only=True,
        help_text="ID do Setor"
    )
    cargo_funcionario = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Funcionario
        fields = [
            'id', 'nome', 'cpf', 'email', 'cep', 'rua', 'numero',
            'bairro', 'cidade', 'estado', 'telefone',
            'cargo', 'setor',
            'cargo_funcionario',
        ]

    def get_cargo_funcionario(self, obj):
        vinculo = Cargo_funcionario.objects.filter(funcionario=obj).first()
        if not vinculo:
            return None
        return {
            "id":    vinculo.id,
            "cargo": vinculo.cargo.id,
            "setor": vinculo.setor.id
        }

    def create(self, validated_data):
        cargo = validated_data.pop('cargo')
        setor = validated_data.pop('setor')
        func = super().create(validated_data)
        Cargo_funcionario.objects.create(funcionario=func, cargo=cargo, setor=setor)
        return func

    def update(self, instance, validated_data):
        cargo = validated_data.pop('cargo', None)
        setor = validated_data.pop('setor', None)
        func = super().update(instance, validated_data)
        if cargo and setor:
            vinculo, created = Cargo_funcionario.objects.get_or_create(
                funcionario=func,
                defaults={'cargo': cargo, 'setor': setor}
            )
            if not created:
                vinculo.cargo = cargo
                vinculo.setor = setor
                vinculo.save()
        return func