# Generated by Django 5.0.2 on 2024-03-06 03:23

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('workflow', '0010_remove_historico_status_id_status_historico_id_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='status',
            name='historico_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='workflow.historico'),
        ),
    ]