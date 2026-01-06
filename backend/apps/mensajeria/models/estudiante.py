from django.db import models

class Estudiante(models.Model):
    # Datos personales
    nombre = models.CharField(max_length=150)
    apellido = models.CharField(max_length=150)
    
    # El dato clave para WhatsApp (debe incluir código país, ej: 591...)
    celular = models.CharField(max_length=20, unique=True)
    
    # Filtros para envío masivo
    carrera = models.CharField(max_length=100)
    facultad = models.CharField(max_length=100, blank=True, null=True)
    
    # Estado (Para no enviar a alumnos inactivos)
    activo = models.BooleanField(default=True)
    
    # Auditoría (Cuándo se creó)
    fecha_registro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nombre} {self.apellido} ({self.celular})"

    class Meta:
        verbose_name = "Estudiante"
        verbose_name_plural = "Estudiantes"
        # Esto crea un índice para buscar rápido por celular
        indexes = [
            models.Index(fields=['celular']),
            models.Index(fields=['carrera']),
        ]