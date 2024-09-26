from django.db import models
from django.utils import timezone

class Pessoa(models.Model):
    nome = models.CharField(max_length=200) 
    cpf = models.CharField(max_length=12) 
    email = models.EmailField(max_length=50)
    cep = models.IntegerField(20,null=True)
    rua = models.CharField(max_length=100,null=True)
    numero = models.IntegerField(10,null=True)
    bairro = models.CharField(max_length=100,null=True)
    cidade = models.CharField(max_length=12)
    estado = models.CharField(max_length=100,null=True)
    telefone = models.CharField(max_length=50) 
    
    def __str__(self) -> str:
        return f'{self.nome}'

 ### "Classes abstratas base" da pra usar aqui para que cliente e funcionário herdem pessoa   ####
 ### link da documentação "https://docs.djangoproject.com/pt-br/4.2/topics/db/models/#abstract-base-classes" #####

class Cliente(models.Model):
  cliente = models.ForeignKey(Pessoa, on_delete= models.CASCADE)
  
  def __str__(self) -> str:
        return f'{self.cliente}'
 
class Funcionario(models.Model):
 funcionario = models.ForeignKey(Pessoa, on_delete=models.CASCADE)

 def __str__(self) -> str:
        return f'{self.funcionario}'
 


class Status(models.Model):
    date_entrada = models.DateTimeField(default=timezone.now)
    date_saida = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=2,default='EN',choices=(
                                 ('EN','Entrada'),
                                 ('OR','Orçamento'),
                                 ('MA','manutenção'),
                                 ('GA','entrega'),
                                 ('SA','Saida')))
    
    def __str__(self) -> str:
        return f'{self.status}'

class Historico(models.Model): 
   status_id = models.ForeignKey(Status, on_delete= models.CASCADE,null=True)
   
   def __str__(self) -> str:
        return f'{self.id}'

class Equipamento(models.Model):
    equipamento = models.CharField(max_length=200) 
    marca= models.CharField(max_length=50) 
    modelo = models.CharField(max_length=50)
    cor = models.CharField(max_length=50 )
    nun_serie = models.CharField(max_length=50)
    cliente = models.ForeignKey(Cliente, on_delete= models.CASCADE)
    historico_id = models.OneToOneField(Historico, on_delete=models.CASCADE)
    
    def __str__(self) -> str:
       return f'{self.equipamento}'


class Setor(models.Model):
    setor = models.CharField(max_length=2,default='EN',choices=(
                                 ('RE','Recepção'),
                                 ('OF','Oficina'),
                                 ('ES','Estoque')))
    status = models.ForeignKey(Status, on_delete = models.CASCADE)
    
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
    Cargo_funcionario = models.ForeignKey(Cargo_funcionario, on_delete= models.CASCADE)

    def __str__(self) -> str:
       return f'{self.id}'
 