#!/usr/bin/env bash
# Build script for Render

set -o errexit

pip install -r requirements.txt

cd backend

# Run migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --noinput

# Seed initial data (optional - only runs if tables are empty)
python manage.py seed_data || true
