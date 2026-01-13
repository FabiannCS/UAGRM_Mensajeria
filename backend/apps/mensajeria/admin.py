from django.contrib import admin
from .models import Estudiante, Carrera, Facultad, HistorialEnvios

# 1. Registramos Facultad para poder crearlas
@admin.register(Facultad)
class FacultadAdmin(admin.ModelAdmin):
    list_display = ('sigla', 'nombre')
    search_fields = ('nombre', 'sigla')

# 2. Registramos Carrera
@admin.register(Carrera)
class CarreraAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'facultad')
    list_filter = ('facultad',) # Aquí sí funciona 'facultad' porque Carrera lo tiene directo
    search_fields = ('nombre',)

# 3. Actualizamos Estudiante
@admin.register(Estudiante)
class EstudianteAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'celular', 'carrera', 'activo')
    
    # CORRECCIÓN DEL ERROR:
    # En lugar de 'facultad', usamos 'carrera__facultad' (con doble guion bajo)
    # Esto le dice a Django: "Ve a la carrera y busca su facultad"
    list_filter = ('activo', 'carrera', 'carrera__facultad') 
    
    search_fields = ('nombre', 'celular')

# 4. Registramos el Historial (Opcional, útil para ver logs)
@admin.register(HistorialEnvios)
class HistorialEnviosAdmin(admin.ModelAdmin):
    list_display = ('fecha_envio', 'cantidad_destinatarios', 'filtro_aplicado')
    readonly_fields = ('mensaje', 'fecha_envio', 'cantidad_destinatarios', 'filtro_aplicado')