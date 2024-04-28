# Generated by Django 5.0.2 on 2024-03-19 10:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('workflow', '0013_status_date_saida_alter_status_date_entrada'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='pessoa',
            name='endereco',
        ),
        migrations.AddField(
            model_name='pessoa',
            name='bairro',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='pessoa',
            name='cep',
            field=models.IntegerField(null=True, verbose_name=20),
        ),
        migrations.AddField(
            model_name='pessoa',
            name='numero',
            field=models.IntegerField(null=True, verbose_name=10),
        ),
        migrations.AddField(
            model_name='pessoa',
            name='rua',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='produto',
            name='preco',
            field=models.IntegerField(verbose_name=50),
        ),
        migrations.AlterField(
            model_name='servico',
            name='valor',
            field=models.IntegerField(verbose_name=50),
        ),
    ]
