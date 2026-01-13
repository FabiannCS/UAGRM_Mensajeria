from django.db import models

class Facultad(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    sigla = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return self.sigla