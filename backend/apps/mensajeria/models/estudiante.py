from django.db import models
from .carrera import Carrera  # <--- Cambio: Importamos desde .carrera

class Estudiante(models.Model):
    nombre = models.CharField(max_length=150)
    apellido = models.CharField(max_length=150)
    celular = models.CharField(max_length=20, unique=True)
    
    # ForeignKey a Carrera
    carrera = models.ForeignKey(Carrera, on_delete=models.SET_NULL, null=True, related_name='estudiantes')
    
    activo = models.BooleanField(default=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nombre} ({self.celular})"