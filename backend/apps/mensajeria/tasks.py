from celery import shared_task
from .services.whatsapp_service import enviar_mensaje_whatsapp
from .models import Estudiante, HistorialEnvios, Carrera

@shared_task
def enviar_masivo_task(mensaje_texto, carrera_id=None):
    """
    Tarea en Background que:
    1. Filtra estudiantes (Todos o por Carrera).
    2. Registra el envío en el Historial.
    3. Envía los mensajes uno por uno.
    """
    
    # 1. PREPARAR LA CONSULTA (QuerySet)
    # Empezamos con todos los activos
    estudiantes = Estudiante.objects.filter(activo=True)
    nombre_filtro = "TODOS" # Por defecto asumimos que es para todos

    # 2. APLICAR FILTRO (Si nos mandaron un ID de carrera)
    if carrera_id:
        # Filtramos la query
        estudiantes = estudiantes.filter(carrera_id=carrera_id)
        
        # Obtenemos el nombre de la carrera para guardarlo bonito en el historial
        try:
            carrera_obj = Carrera.objects.get(id=carrera_id)
            nombre_filtro = carrera_obj.nombre
        except Carrera.DoesNotExist:
            nombre_filtro = f"ID Desconocido ({carrera_id})"

    total = estudiantes.count()
    
    # 3. GUARDAR EN EL HISTORIAL (Auditoría)
    # Esto es vital para saber qué pasó después
    HistorialEnvios.objects.create(
        mensaje=mensaje_texto,
        cantidad_destinatarios=total,
        filtro_aplicado=nombre_filtro
    )

    print(f"🚀 INICIANDO CAMPAÑA: {nombre_filtro} | TOTAL: {total} mensajes")
    
    for alumno in estudiantes:
        # 1. Copiamos el mensaje original para no modificar la plantilla base
        mensaje_personalizado = mensaje_texto

        # 2. REEMPLAZO INTELIGENTE
        # Si el mensaje contiene "{nombre}", lo cambiamos por el nombre del alumno
        if "{nombre}" in mensaje_personalizado:
            mensaje_personalizado = mensaje_personalizado.replace("{nombre}", alumno.nombre)
        
        # Si quieres agregar la carrera también:
        if "{carrera}" in mensaje_personalizado and alumno.carrera:
             mensaje_personalizado = mensaje_personalizado.replace("{carrera}", alumno.carrera.nombre)

        # 3. Enviamos el mensaje YA personalizado
        enviar_mensaje_whatsapp(alumno.celular, mensaje_personalizado)
        
    print("🏁 FIN DE LA CAMPAÑA MASIVA")
    return f"Se enviaron {total} mensajes al segmento: {nombre_filtro}."