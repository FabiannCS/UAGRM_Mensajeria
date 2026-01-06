import os
from celery import Celery

# Establecemos el módulo de configuración de Django (apunta a development)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')

# Creamos la instancia de la aplicación Celery
app = Celery('config')

# Le decimos que lea la configuración desde el archivo settings de Django
# usando el prefijo CELERY_
app.config_from_object('django.conf:settings', namespace='CELERY')

# Busca tareas (tasks.py) en todas las apps registradas automáticamente
app.autodiscover_tasks()