#!/bin/sh

# wait for RabbitMQ server to start
sleep 10

cd /usr/src/app

# run Celery worker for our project myproject with Celery configuration stored in Celeryconf
su -m myuser -c "celery worker -A formulavis.celeryconf -Q default -n default@%h"