from django.db import models
from .estudiante import Estudiante  # <--- IMPORTANTE: Importamos al Padre

class Mensaje(models.Model):
    # Relación: Un mensaje pertenece a un estudiante
    estudiante = models.ForeignKey(Estudiante, on_delete=models.CASCADE, related_name='mensajes')
    
    # ID de WhatsApp para evitar duplicados
    whatsapp_id = models.CharField(max_length=100, unique=True, null=True, blank=True)
    
    texto = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    TIPO_CHOICES = [
        ('ENTRADA', 'Entrante (Estudiante)'),
        ('SALIDA', 'Saliente (Bot)'),
    ]
    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES, default='ENTRADA')
    
    ESTADO_CHOICES = [
        ('ENVIADO', 'Enviado'),
        ('ENTREGADO', 'Entregado'),
        ('LEIDO', 'Leído'),
        ('FALLIDO', 'Fallido'),
    ]
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='ENVIADO')

    def __str__(self):
        direccion = "⬅️" if self.tipo == 'ENTRADA' else "➡️"
        return f"{direccion} {self.texto[:30]}..."

    class Meta:
        ordering = ['timestamp']
        verbose_name = "Mensaje"
        verbose_name_plural = "Mensajes"