from celery import shared_task
# Importamos tu servicio (asegúrate de que la ruta sea correcta)
from .services.whatsapp_service import enviar_mensaje_whatsapp
from .models import Estudiante, HistorialEnvios, Carrera

@shared_task
def enviar_masivo_task(mensaje_texto, carrera_id=None):
    # 1. PREPARAR CONSULTA
    estudiantes = Estudiante.objects.filter(activo=True)
    nombre_filtro = "TODOS" 

    # 2. APLICAR FILTRO
    if carrera_id:
        estudiantes = estudiantes.filter(carrera_id=carrera_id)
        try:
            nombre = Carrera.objects.get(id=carrera_id).nombre
            nombre_filtro = nombre
        except:
            nombre_filtro = "Desconocido"

    total = estudiantes.count()
    
    # 3. GUARDAR HISTORIAL
    HistorialEnvios.objects.create(
        mensaje=mensaje_texto,
        cantidad_destinatarios=total,
        filtro_aplicado=nombre_filtro
    )

    print(f"🚀 INICIANDO ENVIO DE MENSAJES: {nombre_filtro} | TOTAL: {total}")
    
    conteo_exitos = 0

    # 4. BUCLE DE ENVÍO
    for alumno in estudiantes:
        # A. Personalización
        mensaje_final = mensaje_texto
        if "{nombre}" in mensaje_final:
            mensaje_final = mensaje_final.replace("{nombre}", alumno.nombre)
        if "{carrera}" in mensaje_final and alumno.carrera:
             mensaje_final = mensaje_final.replace("{carrera}", alumno.carrera.nombre)

        # B. Usamos el servicio externo (que ya tiene la lógica del 591)
        if enviar_mensaje_whatsapp(alumno.celular, mensaje_final):
            conteo_exitos += 1
        
    print("🏁 FIN DEL ENVIO DE TODOS LOS MENSAJES")
    return f"Se enviaron {conteo_exitos} de {total} mensajes."