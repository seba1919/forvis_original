#!/bin/sh

# wait for PSQL server to start
sleep 10

cd /usr/src/app

# prepare init migration
su -m myuser -c "python manage.py makemigrations formulavis"

# migrate db, so we have the latest db schema
su -m myuser -c "python manage.py migrate"

# create super user
su -m myuser -c "python manage.py shell -c \"from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@example.com', 'admin')\""

# start development server on public ip interface, on port 8000
su -m myuser -c "python manage.py runserver backend:8000"