from django.db import models
from .facultad import Facultad  # <--- Importamos el modelo desde su archivo

class Carrera(models.Model):
    nombre = models.CharField(max_length=100)
    facultad = models.ForeignKey(Facultad, on_delete=models.CASCADE, related_name='carreras')

    def __str__(self):
        return self.nombre