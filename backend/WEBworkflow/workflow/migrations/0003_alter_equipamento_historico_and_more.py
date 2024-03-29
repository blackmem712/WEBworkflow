# Generated by Django 5.0.2 on 2024-03-06 02:18

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('workflow', '0002_remove_historico_equipamento_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='equipamento',
            name='historico',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='workflow.historico'),
        ),
        migrations.AlterField(
            model_name='historico',
            name='status_id',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='workflow.status'),
        ),
    ]
