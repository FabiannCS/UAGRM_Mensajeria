import requests 
from django.conf import settings

def enviar_mensaje_whatsapp(numero, mensaje):
    """
    Envía un mensaje de texto real usando la API Cloud de WhatsApp.
    Realiza la limpieza automática del número (agrega 591 si falta).
    """
    # 1. Obtenemos credenciales
    token = settings.WHATSAPP_TOKEN
    id_telefono = settings.WHATSAPP_PHONE_ID
    version = 'v24.0'

    # 2. URL de Meta
    url = f"https://graph.facebook.com/{version}/{id_telefono}/messages"

    # 3. Encabezados
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }


    # Quitamos espacios, símbolos '+' o guiones
    numero_limpio = str(numero).replace('+', '').replace(' ', '').replace('-', '').strip()
    
    # Si tiene 8 dígitos (ej: 70012345), es Bolivia -> agregamos 591
    if len(numero_limpio) == 8:
        numero_limpio = f"591{numero_limpio}"
    # -----------------------------------------------------

    # 4. Cuerpo del mensaje
    payload = {
        "messaging_product": "whatsapp",
        "to": numero_limpio, # Usamos el número corregido
        "type": "text",
        "text": {
            "body": mensaje
        }
    }

    try:
        # 5. Enviamos la petición
        response = requests.post(url, headers=headers, json=payload)
        
        if response.status_code in [200, 201]:
            print(f"✅ ÉXITO: Mensaje enviado a {numero_limpio}")
            return True
        else:
            print(f"❌ ERROR META: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ ERROR DE CONEXIÓN: {str(e)}")
        return False