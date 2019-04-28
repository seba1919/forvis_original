#!/bin/sh

# wait for PSQL server to start
sleep 10

cd /usr/src/app

# prepare init migration
su -m myuser -c "python manage.py makemigrations formulavis"

# migrate db, so we have the latest db schema
su -m myuser -c "python manage.py migrate"

# start development server on public ip interface, on port 8000
su -m myuser -c "python manage.py runserver backend:8000"