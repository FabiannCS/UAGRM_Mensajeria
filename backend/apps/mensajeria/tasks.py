from celery import shared_task
from .services.whatsapp_service import enviar_mensaje_whatsapp
from .models import Estudiante

@shared_task
def enviar_masivo_task(mensaje_texto):
    """
    Tarea que se ejecuta en segundo plano (Background).
    Recorre los alumnos y manda los mensajes uno por uno.
    """
    # Obtenemos todos los estudiantes activos
    estudiantes = Estudiante.objects.filter(activo=True)
    total = estudiantes.count()
    
    print(f"🚀 INICIANDO CAMPAÑA MASIVA PARA {total} ESTUDIANTES...")
    
    for alumno in estudiantes:
        # Llamamos al servicio (Simulado)
        enviar_mensaje_whatsapp(alumno.celular, mensaje_texto)
        
    print("🏁 FIN DE LA CAMPAÑA MASIVA")
    return f"Se procesaron {total} mensajes."