# Generated by Django 5.0.2 on 2024-09-26 00:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('workflow', '0015_pessoa_estado'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='funcionario',
            name='funcionario',
        ),
        migrations.RemoveField(
            model_name='cliente',
            name='cliente',
        ),
        migrations.AddField(
            model_name='cliente',
            name='bairro',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='cliente',
            name='cep',
            field=models.IntegerField(null=True, verbose_name=20),
        ),
        migrations.AddField(
            model_name='cliente',
            name='cidade',
            field=models.CharField(max_length=12, null=True),
        ),
        migrations.AddField(
            model_name='cliente',
            name='cpf',
            field=models.CharField(max_length=12, null=True),
        ),
        migrations.AddField(
            model_name='cliente',
            name='email',
            field=models.EmailField(max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='cliente',
            name='estado',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='cliente',
            name='nome',
            field=models.CharField(max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='cliente',
            name='numero',
            field=models.IntegerField(null=True, verbose_name=10),
        ),
        migrations.AddField(
            model_name='cliente',
            name='rua',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='cliente',
            name='telefone',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='funcionario',
            name='bairro',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='funcionario',
            name='cep',
            field=models.IntegerField(null=True, verbose_name=20),
        ),
        migrations.AddField(
            model_name='funcionario',
            name='cidade',
            field=models.CharField(max_length=12, null=True),
        ),
        migrations.AddField(
            model_name='funcionario',
            name='cpf',
            field=models.CharField(max_length=12, null=True),
        ),
        migrations.AddField(
            model_name='funcionario',
            name='email',
            field=models.EmailField(max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='funcionario',
            name='estado',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='funcionario',
            name='nome',
            field=models.CharField(max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='funcionario',
            name='numero',
            field=models.IntegerField(null=True, verbose_name=10),
        ),
        migrations.AddField(
            model_name='funcionario',
            name='rua',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='funcionario',
            name='telefone',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.DeleteModel(
            name='Pessoa',
        ),
    ]
