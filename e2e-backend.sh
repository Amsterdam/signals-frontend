#!/bin/bash

# Run database migrations
python manage.py migrate

# Create signals.admin@example.com user
echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('signals.admin@example.com', 'signals.admin@example.com', 'password')" | python manage.py shell

# Start the uwsgi server
/usr/local/bin/uwsgi --master \
    --http=:8000 \
    --module=signals.wsgi:application \
    --processes=4 \
    --threads=2 \
    --static-map=/signals/static=/static \
    --static-map=/signals/media=/media \
    --die-on-term
