"""
Root WSGI configuration for Render deployment.
This file allows Render to find the Django application when running from the project root.
"""
import os
import sys

# Add the backend directory to the Python path
backend_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backend')
sys.path.insert(0, backend_path)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
