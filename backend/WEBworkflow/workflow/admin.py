from django.contrib import admin

from workflow.models import models

@admin.register(models.Pessoa)
class WorkflowAdmin(admin.ModelAdmin):
    ...

@admin.register(models.Cliente)
class WorkflowAdmin(admin.ModelAdmin):
    ...

@admin.register(models.Funcionario)
class WorkflowAdmin(admin.ModelAdmin):
    ...

@admin.register(models.Equipamento)
class WorkflowAdmin(admin.ModelAdmin):
    ...

@admin.register(models.Historico)
class WorkflowAdmin(admin.ModelAdmin):
    ...

@admin.register(models.Setor)
class WorkflowAdmin(admin.ModelAdmin):
    ...


@admin.register(models.Cargo_funcionario)
class WorkflowAdmin(admin.ModelAdmin):
    ...
@admin.register(models.Servico)
class WorkflowAdmin(admin.ModelAdmin):
    ...
@admin.register(models.Produto)
class WorkflowAdmin(admin.ModelAdmin):
    ...  
@admin.register(models.Fornecedor)
class WorkflowAdmin(admin.ModelAdmin):
    ...
@admin.register(models.Orcamento)
class WorkflowAdmin(admin.ModelAdmin):
    ...