# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2019-06-12 10:16
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0010_auto_20181226_1803'),
    ]

    operations = [
        migrations.AlterField(
            model_name='jsonfile',
            name='json_format',
            field=models.CharField(choices=[('sat_vis_tree', 'sat_vis_tree'), ('sat_vis_factor', 'sat_vis_factor'), ('sat_vis_interaction', 'sat_vis_interaction'), ('sat_vis_resolution', 'sat_vis_resolution'), ('raw', 'raw'), ('variables', 'variables'), ('maxsat_vis_tree', 'maxsat_vis_tree'), ('maxsat_vis_factor', 'maxsat_vis_factor'), ('maxsat_vis_interaction', 'maxsat_vis_interaction'), ('maxsat_vis_resolution', 'maxsat_vis_resolution')], max_length=255),
        ),
    ]
