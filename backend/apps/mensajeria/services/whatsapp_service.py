import requests
import json
from django.conf import settings

def enviar_mensaje_whatsapp(numero, mensaje):
    """
    Envía un mensaje de texto real usando la API Cloud de WhatsApp.
    """
    # 1. Obtenemos las credenciales del archivo .env (Las configuraremos pronto)
    token = settings.WHATSAPP_TOKEN
    id_telefono = settings.WHATSAPP_PHONE_ID
    version = 'v17.0' # O la versión actual de la API

    # 2. Preparamos la URL de Meta
    url = f"https://graph.facebook.com/{version}/{id_telefono}/messages"

    # 3. Preparamos los encabezados de seguridad
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    # 4. Preparamos el cuerpo del mensaje (JSON)
    # Nota: La API es estricta con el formato
    payload = {
        "messaging_product": "whatsapp",
        "to": numero, # El número debe tener código de país sin el símbolo +
        "type": "text",
        "text": {
            "body": mensaje
        }
    }

    try:
        # 5. ¡Fuego! Enviamos la petición
        response = requests.post(url, headers=headers, json=payload)
        
        # Verificamos si salió bien (Código 200 o 201)
        if response.status_code in [200, 201]:
            print(f"✅ ÉXITO: Mensaje enviado a {numero}")
            return True
        else:
            print(f"❌ ERROR META: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ ERROR DE CONEXIÓN: {str(e)}")
        return False