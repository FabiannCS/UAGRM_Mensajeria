import json
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from apps.mensajeria.services.whatsapp_service import enviar_mensaje_whatsapp
# Importamos SOLO el orquestador
from apps.mensajeria.services.chatbot_service import procesar_mensaje_hibrido

VERIFY_TOKEN = "HOLA_UAGRM_1234"

@csrf_exempt
def whatsapp_webhook(request):
    # 1. VERIFICACIÓN (GET)
    if request.method == 'GET':
        mode = request.GET.get('hub.mode')
        token = request.GET.get('hub.verify_token')
        challenge = request.GET.get('hub.challenge')
        if mode == 'subscribe' and token == VERIFY_TOKEN:
            return HttpResponse(challenge, status=200)
        return HttpResponse('Forbidden', status=403)
    
    # 2. RECEPCIÓN (POST)
    if request.method == 'POST':
        try:
            body = json.loads(request.body.decode('utf-8'))
            
            if 'entry' in body:
                changes = body['entry'][0]['changes'][0]
                value = changes['value']
                
                if 'messages' in value:
                    msg = value['messages'][0]
                    
                    if msg['type'] == 'text':
                        texto = msg['text']['body']
                        remitente = msg['from'] # El número de celular
                        
                        # Intentamos obtener el nombre del perfil de WhatsApp (si existe)
                        nombre_perfil = value.get('contacts', [{}])[0].get('profile', {}).get('name', 'Estudiante')
                        
                        # --- AQUÍ ESTÁ EL CAMBIO ---
                        # Ahora pasamos también el remitente y el nombre
                        respuesta_final = procesar_mensaje_hibrido(texto, remitente, nombre_perfil)
                        # ---------------------------

                        enviar_mensaje_whatsapp(remitente, respuesta_final)
                        
            return HttpResponse('EVENT_RECEIVED', status=200)
            
        except Exception as e:
            print(f"❌ Error: {e}")
            return HttpResponse('ERROR', status=500)