#!/usr/bin/env bash
cd backend
gunicorn config.wsgi:application
