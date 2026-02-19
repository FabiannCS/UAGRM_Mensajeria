import openai
from django.conf import settings
import os

def obtener_respuesta_ia(texto_usuario):
    """
    Consulta a OpenAI si no hay reglas que apliquen.
    """
    # Verificamos si hay API KEY configurada
    api_key = getattr(settings, 'OPENAI_API_KEY', None) or os.getenv('OPENAI_API_KEY')
    
    if not api_key:
        return "⚠️ Error: No tengo mi cerebro conectado (Falta API Key)."

    try:
        client = openai.OpenAI(api_key=api_key)
        
        prompt_sistema = """
        Eres un asistente útil de la Universidad UAGRM.
        Responde de forma breve, amable y directa.
        No inventes información administrativa, si no sabes, sugiere ir a jefatura.
        """

        response = client.chat.completions.create(
            model="gpt-4o-mini", # Modelo rápido y económico
            messages=[
                {"role": "system", "content": prompt_sistema},
                {"role": "user", "content": texto_usuario}
            ],
            max_tokens=250,
            temperature=0.3
        )
        return response.choices[0].message.content.strip()

    except Exception as e:
        print(f"❌ Error OpenAI: {e}")
        return "Lo siento, tuve un problema procesando tu solicitud inteligente."