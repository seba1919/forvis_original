#script used by crontab

from django.contrib.auth.models import User
from datetime import datetime
from django.utils import timezone
from datetime import timedelta

users = User.objects.all()
now = datetime.now(tz=timezone.utc)

for user in users:
    if now - user.last_login > timedelta(days=6*30):
        user.delete()
