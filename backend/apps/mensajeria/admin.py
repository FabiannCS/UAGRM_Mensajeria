from django.contrib import admin
from .models import Estudiante

@admin.register(Estudiante)
class EstudianteAdmin(admin.ModelAdmin):
    # Qué columnas mostrar en la lista
    list_display = ('nombre', 'apellido', 'celular', 'carrera', 'activo')
    # Por qué campos se puede buscar
    search_fields = ('nombre', 'celular', 'carrera')
    # Filtros laterales
    list_filter = ('carrera', 'activo', 'facultad')