from django.urls import path
from .views import whatsapp_webhook  # <--- Importación relativa simple (porque son vecinos)

urlpatterns = [
    path('webhook/', whatsapp_webhook, name='webhook_whatsapp'),
]