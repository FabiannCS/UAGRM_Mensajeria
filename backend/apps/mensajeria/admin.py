from django.contrib import admin
from .models import Estudiante, Carrera, Facultad, HistorialEnvios, Mensaje

# --- 1. CONFIGURACIÓN DEL CHAT INTEGRADO (INLINE) ---
class MensajeInline(admin.TabularInline):
    """ Esto permite ver la lista de mensajes DENTRO del perfil del estudiante. """
    model = Mensaje
    extra = 0  
    readonly_fields = ('timestamp', 'tipo', 'estado', 'whatsapp_id')
    ordering = ('timestamp',)
    can_delete = False

# --- 2. REGISTROS EXISTENTES (Facultad, Carrera) ---
@admin.register(Facultad)
class FacultadAdmin(admin.ModelAdmin):
    list_display = ('sigla', 'nombre')
    search_fields = ('nombre', 'sigla')

@admin.register(Carrera)
class CarreraAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'facultad')
    list_filter = ('facultad',) 
    search_fields = ('nombre',)

# --- 3. ESTUDIANTE (Aquí estaba lo que faltaba) ---
@admin.register(Estudiante)
class EstudianteAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'celular', 'carrera', 'activo')
    
    # Tus filtros relacionales (Perfectos)
    list_filter = ('activo', 'carrera', 'carrera__facultad') 
    
    search_fields = ('nombre', 'celular')

    # >>> CAMBIO 1: AGREGAMOS ESTA LÍNEA <<<
    # Esto conecta el Inline de arriba con el Estudiante gracias a la Foreign Key
    inlines = [MensajeInline]

# --- 4. HISTORIAL (Tu log de envíos masivos) ---
@admin.register(HistorialEnvios)
class HistorialEnviosAdmin(admin.ModelAdmin):
    list_display = ('fecha_envio', 'cantidad_destinatarios', 'filtro_aplicado')
    readonly_fields = ('mensaje', 'fecha_envio', 'cantidad_destinatarios', 'filtro_aplicado')

# --- 5. MENSAJES (Vista Global - NUEVO) ---
# >>> CAMBIO 2: REGISTRAMOS EL MODELO MENSAJE <<<
@admin.register(Mensaje)
class MensajeAdmin(admin.ModelAdmin):
    list_display = ('timestamp', 'estudiante', 'tipo_visual', 'texto_corto', 'estado')
    list_filter = ('tipo', 'estado', 'timestamp')
    
    # Búsqueda inteligente: busca en el texto O en el nombre del estudiante relacionado
    search_fields = ('texto', 'estudiante__nombre', 'estudiante__celular')
    
    readonly_fields = ('timestamp',)

    def tipo_visual(self, obj):
        return "⬅️ Recibido" if obj.tipo == 'ENTRADA' else "➡️ Enviado"
    
    def texto_corto(self, obj):
        return obj.texto[:60] + "..." if len(obj.texto) > 60 else obj.texto