from django.db import models

class HistorialEnvios(models.Model):
    mensaje = models.TextField()
    fecha_envio = models.DateTimeField(auto_now_add=True)
    cantidad_destinatarios = models.IntegerField()
    # Guardamos el nombre del filtro usado (Ej: "Ing. Sistemas" o "TODOS")
    filtro_aplicado = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return f"Envío {self.id} - {self.fecha_envio.strftime('%d/%m/%Y')}"