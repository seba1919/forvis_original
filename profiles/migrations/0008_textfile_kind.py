# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2018-06-19 06:48
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0007_auto_20171204_2111'),
    ]

    operations = [
        migrations.AddField(
            model_name='textfile',
            name='kind',
            field=models.CharField(default='sat', max_length=10),
            preserve_default=False,
        ),
    ]
