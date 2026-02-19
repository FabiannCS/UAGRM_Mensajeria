from datetime import datetime
try:
    import pytz
except ImportError:
    pytz = None

def obtener_saludo_segun_hora():
    try:
        if pytz:
            tz_bolivia = pytz.timezone('America/La_Paz')
            hora_actual = datetime.now(tz_bolivia).hour
        else:
            hora_actual = datetime.now().hour
    except:
        hora_actual = datetime.now().hour

    if 5 <= hora_actual < 12:
        return "Buenos días ☀️"
    elif 12 <= hora_actual < 19:
        return "Buenas tardes 🌤️"
    else:
        return "Buenas noches 🌙"

def obtener_respuesta_reglas(texto_usuario, nombre_estudiante=None):
    texto = texto_usuario.lower().strip()
    
    # --- DEBUGGING (Mira esto en tu consola negra) ---
    print(f"🔎 ANALIZANDO MENSAJE: '{texto}'")

    nombre_txt = f" {nombre_estudiante}" if nombre_estudiante else ""
    saludo_tiempo = obtener_saludo_segun_hora()
    
    parte_saludo = ""
    parte_contenido = ""

    # --- 1. DETECTAR SALUDO ---
    palabras_saludo = ["hola", "buenas", "buenos", "inicio", "empezar", "bot", "hey", "ola"]
    
    for word in palabras_saludo:
        if word in texto: # Busca si la palabra está en el texto
            print(f"   ✅ Saludo detectado por palabra clave: '{word}'")
            parte_saludo = f"👋 ¡{saludo_tiempo}{nombre_txt}!\n"
            break # Dejamos de buscar saludos

    # --- 2. DETECTAR TEMA (Usamos if/elif para que solo elija UNO) ---
    
    # TEMA: FECHAS
    lista_fechas = ["fecha", "cuando", "calendario", "inicio de clases", "finales", "cronograma", "inscripciones"]
    if any(word in texto for word in lista_fechas):
        # Averiguamos cuál palabra activó esto para el debug
        match = next((w for w in lista_fechas if w in texto), None)
        print(f"   📅 Tema FECHAS detectado por clave: '{match}'")
        parte_contenido = f"📅 *Calendario Académico:*\n- Inicio de clases: 10 de Marzo\n- Retiros: 20 de Abril\n- Finales: 15 de Julio"

    # TEMA: UBICACIÓN
    elif any(word in texto for word in ["donde", "ubicacion", "mapa", "lugar", "queda", "direccion"]):
        print(f"   📍 Tema UBICACION detectado")
        parte_contenido = "📍 *Ubicación:*\nEstamos en el Campus Universitario, Módulo 225 (Ingeniería).\nVer en Google Maps: https://goo.gl/maps/tu-ubicacion"

    # TEMA: REQUISITOS
    elif any(word in texto for word in ["requisito", "papeles", "documento", "fotocopia", "inscripcion"]):
        print(f"   📝 Tema REQUISITOS detectado")
        parte_contenido = "📝 *Requisitos de Inscripción:*\n1. Fotocopia de C.I.\n2. Título de Bachiller\n3. Boleta de pago."

    # TEMA: PAGOS
    elif any(word in texto for word in ["pago", "banco", "costo", "mensualidad", "precio", "matricula"]):
        print(f"   💰 Tema PAGOS detectado")
        parte_contenido = "💰 *Pagos:*\nPuedes pagar en el Banco Unión, cuenta 1-234567. El costo del semestre es Bs. 50."

    # --- 3. ENSAMBLAR ---
    
    if parte_saludo and parte_contenido:
        print("   👉 Resultado: Saludo + Contenido")
        return f"{parte_saludo}\n{parte_contenido}"
    
    if not parte_saludo and parte_contenido:
        print("   👉 Resultado: Solo Contenido")
        return parte_contenido
    
    if parte_saludo and not parte_contenido:
        print("   👉 Resultado: Solo Saludo (Mostrando Menú)")
        return (
            f"{parte_saludo}\n"
            f"Soy el Asistente Virtual de la UAGRM. 🎓\n\n"
            f"Escribe lo que necesitas, por ejemplo:\n"
            f"👉 'Ver calendario'\n"
            f"👉 'Ubicación del módulo'\n"
            f"👉 'Requisitos de inscripción'"
        )

    print("   ❌ Ninguna regla coincidió (Pasando a IA)")
    return None