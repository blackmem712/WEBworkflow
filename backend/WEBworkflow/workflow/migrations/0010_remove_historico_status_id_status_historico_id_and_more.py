# Generated by Django 5.0.2 on 2024-03-06 03:18

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('workflow', '0009_alter_equipamento_historico_id'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='historico',
            name='status_id',
        ),
        migrations.AddField(
            model_name='status',
            name='historico_id',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='workflow.historico'),
        ),
        migrations.AlterField(
            model_name='equipamento',
            name='historico_id',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='workflow.historico'),
        ),
    ]
