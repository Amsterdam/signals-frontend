#!/bin/bash

# Wait for database to be up
RETRIES=60
until nc -z $DATABASE_HOST_OVERRIDE $DATABASE_PORT_OVERRIDE || [ $RETRIES -eq 0 ]; do
  echo "Waiting for postgres server, $((RETRIES--)) remaining attempts..."
  sleep 1
done

# Run database migrations
python manage.py migrate

# Load areas
python manage.py load_areas stadsdeel
python manage.py load_areas cbs-gemeente-2019
python manage.py load_areas sia-stadsdeel

# Create signals.admin@example.com user
echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(username='signals.admin@example.com').exists() or User.objects.create_superuser('signals.admin@example.com', 'signals.admin@example.com', 'password')" | python manage.py shell

if [[ ${INITIALIZE_WITH_DUMMY_DATA:-0} == 1 ]]; then
  echo "Load dummy data"

  # Other scripts to load data should be placed here
  python manage.py dummy_sources --to-create 10

  echo "[$(date +"%FT%T%z")] - Done!!!" >> "$LOGFILE"
fi

# Start the uwsgi server
/usr/local/bin/uwsgi --master \
    --http=:8000 \
    --module=signals.wsgi:application \
    --processes=4 \
    --threads=2 \
    --static-map=/signals/static=/static \
    --static-map=/signals/media=/media \
    --die-on-term
