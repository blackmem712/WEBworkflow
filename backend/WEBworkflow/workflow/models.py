from django.db import models
from django.utils import timezone

class Pessoa(models.Model):
    nome = models.CharField(max_length=200,null=True) 
    cpf = models.CharField(max_length=12,null=True) 
    email = models.EmailField(max_length=50,null=True)
    cep = models.IntegerField(20,null=True)
    rua = models.CharField(max_length=100,null=True)
    numero = models.IntegerField(10,null=True)
    bairro = models.CharField(max_length=100,null=True)
    bairro = models.CharField(max_length=100,null=True)
    cidade = models.CharField(max_length=50,null=True)
    estado = models.CharField(max_length=100,null=True)
    telefone = models.CharField(max_length=50,null=True) 
    
    class Meta:
        abstract = True  # Tornando Pessoa uma classe abstrata

    def __str__(self):
        return self.nome


class Cliente(Pessoa):  # Herança de Pessoa
    def __str__(self):
        return self.nome


class Funcionario(Pessoa):  # Herança de Pessoa
    def __str__(self):
        return self.nome


 


class Historico(models.Model):
    status_id = models.ForeignKey(
        'Status',                      # <- string
        on_delete=models.CASCADE,
        null=True,
        related_name='historicos_vigentes',
        related_query_name='historico_vigente',
    )
    def __str__(self) -> str:
        return f'{self.id}'


class Status(models.Model):
    historico = models.ForeignKey(
        'Historico',                   # <- string
        on_delete=models.CASCADE,
        related_name='statuses',
        related_query_name='status',
        null=True, blank=True,
    )
    date_entrada = models.DateTimeField(default=timezone.now)
    date_saida   = models.DateTimeField(null=True, blank=True)
    status = models.CharField(
        max_length=2,
        default='EN',
        choices=(
            ('EN','Entrada'),
            ('OR','Orçamento'),
            ('MA','manutenção'),
            ('GA','entrega'),
            ('SA','Saida'),
        )
    )
    def __str__(self) -> str:
        return f'{self.status}'

class Equipamento(models.Model):
    equipamento = models.CharField(max_length=200) 
    marca= models.CharField(max_length=50) 
    modelo = models.CharField(max_length=50)
    cor = models.CharField(max_length=50 )
    nun_serie = models.CharField(max_length=50)
    cliente = models.ForeignKey(Cliente, on_delete= models.CASCADE)
    historico_id = models.OneToOneField(Historico, on_delete=models.CASCADE,null=True)
    
    def __str__(self) -> str:
       return f'{self.equipamento}'


class Setor(models.Model):
    setor = models.CharField(max_length=2,default='EN',choices=(
                                 ('RE','Recepção'),
                                 ('OF','Oficina'),
                                 ('ES','Estoque')))
    
    
    def __str__(self) -> str:
       return f'{self.setor}'


class Cargo(models.Model):
 cargo = models.CharField(max_length=2,default='EN',choices=(
                                 ('RC','Recepcionista'),
                                 ('TC','Técnico'),
                                 ('GE','Gerente')))
 
 def __str__(self) -> str:
       return f'{self.cargo}'
 
class Cargo_funcionario(models.Model):
   funcionario = models.ForeignKey(Funcionario, on_delete=models.CASCADE)
   setor = models.ForeignKey(Setor, on_delete=models.CASCADE)
   cargo = models.ForeignKey(Cargo, on_delete=models.CASCADE)
   

   def __str__(self) -> str:
       return f'{self.id}'
   
class Servico(models.Model):
    nome = models.CharField(max_length=200) 
    valor= models.IntegerField(50)
    descricao = models.TextField()   

    def __str__(self) -> str:
       return f'{self.nome}'

class Produto(models.Model):
    nome = models.CharField(max_length=50) 
    marca = models.CharField(max_length=50) 
    modelo= models.CharField(max_length=50)
    preco = models.IntegerField(50)
    descricao = models.TextField() 
    
    def __str__(self) -> str:
       return f'{self.nome}'

class Fornecedor(models.Model):
    produtos = models.ManyToManyField(Produto) 
    nome = models.CharField(max_length=50)   
    cnpj = models.CharField(max_length=50) 
    telefone = models.CharField(max_length=50) 
    descricao = models.TextField() 
    
    def __str__(self) -> str:
       return f'{self.nome}'

class Orcamento(models.Model):
    observacao = models.TextField()
    equipamento = models.ForeignKey(Equipamento, on_delete=models.CASCADE)
    servico = models.ManyToManyField(Servico)
    produto = models.ManyToManyField(Produto, blank=False)
    cargo_funcionario = models.ForeignKey(Cargo_funcionario, on_delete= models.CASCADE)

    def __str__(self) -> str:
       return f'{self.id}'
 