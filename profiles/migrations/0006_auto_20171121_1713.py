# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2017-11-21 17:13
from __future__ import unicode_literals

import django.contrib.postgres.fields.jsonb
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0005_auto_20171119_2014'),
    ]

    operations = [
        migrations.AlterField(
            model_name='jsonfile',
            name='content',
            field=django.contrib.postgres.fields.jsonb.JSONField(default={}),
        ),
    ]
