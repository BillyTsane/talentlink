#!/usr/bin/env bash
set -e
if [ ! -f ".env" ]; then cp .env.example .env; fi
python manage.py makemigrations
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
