from .rules_service import obtener_respuesta_reglas
from .openai_service import obtener_respuesta_ia
from apps.mensajeria.models import Estudiante, Mensaje

def procesar_mensaje_hibrido(texto_usuario, numero_telefono, nombre_perfil=None):
    """
    Lógica Amigable:
    - Si es Estudiante: Guarda historial y usa IA.
    - Si es Desconocido: Responde dudas generales (Reglas) o saluda, pero NO guarda en BD.
    """
    print(f"🔍 Procesando mensaje de: {numero_telefono}")

    estudiante = None
    es_estudiante_registrado = False

    # 1. INTENTAMOS IDENTIFICAR AL ESTUDIANTE
    try:
        estudiante = Estudiante.objects.get(celular=numero_telefono)
        es_estudiante_registrado = True
        print(f"✅ Estudiante identificado: {estudiante.nombre}")
    except Estudiante.DoesNotExist:
        print("👤 Usuario desconocido (Modo Invitado)")
        es_estudiante_registrado = False

    # 2. SI ES ESTUDIANTE, GUARDAMOS EL MENSAJE DE ENTRADA
    if es_estudiante_registrado:
        Mensaje.objects.create(
            estudiante=estudiante,
            texto=texto_usuario,
            tipo='ENTRADA',
            estado='LEIDO'
        )

    # 3. CEREBRO (Decidir respuesta)
    
    # A) Primero buscamos en las REGLAS (Información pública: Ubicación, Fechas, etc.)
    # Esto funciona tanto para Estudiantes como para Invitados.
    nombre_para_saludo = estudiante.nombre if estudiante else "Estudiante"
    
    respuesta_final = obtener_respuesta_reglas(texto_usuario, nombre_para_saludo)
    
    # B) Si no hay regla...
    if not respuesta_final:
        if es_estudiante_registrado:
            # Si es ESTUDIANTE, le damos el poder de la IA
            print("🔄 Consultando a OpenAI para estudiante...")
            respuesta_final = obtener_respuesta_ia(texto_usuario)
        else:
            # Si es INVITADO, le damos el Saludo Amigable (Tu requerimiento)
            respuesta_final = (
                "👋 *¡Hola! Soy el asistente virtual de la UAGRM.*\n\n"
                "No tengo tu número registrado como estudiante oficial, pero puedo ayudarte con información general:\n\n"
                "📅 *Fechas* (Calendario)\n"
                "📍 *Ubicación* (Módulos)\n"
                "📝 *Requisitos* de inscripción\n\n"
                "Si ya eres estudiante, por favor actualiza tus datos en Jefatura."
            )

    # 4. GUARDAR RESPUESTA SALIENTE (Solo si es estudiante)
    if es_estudiante_registrado:
        Mensaje.objects.create(
            estudiante=estudiante,
            texto=respuesta_final,
            tipo='SALIDA',
            estado='ENVIADO'
        )
    
    # Retornamos la respuesta para que se envíe por WhatsApp (a cualquiera de los dos)
    return respuesta_final