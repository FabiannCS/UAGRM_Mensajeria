import requests
import sys

# Si escribes argumentos al ejecutar, úsalos. Si no, usa "Hola" por defecto.
if len(sys.argv) > 1:
    mensaje = " ".join(sys.argv[1:])
else:
    mensaje = "Hola"
# URL local de tu Django
url = 'http://127.0.0.1:8000/api/mensajeria/webhook/'


# Si pasas argumentos al ejecutar, usaremos ese mensaje
if len(sys.argv) > 1:
    mensaje = " ".join(sys.argv[1:])

payload = {
  "object": "whatsapp_business_account",
  "entry": [{
    "changes": [{
      "value": {
        "messages": [{
          "from": "59171045916",
          "type": "text",
          "text": {"body": mensaje}
        }],
        "contacts": [{"profile": {"name": "Tester"}}]
      }
    }]
  }]
}

print(f"📡 SIMULANDO MENSAJE: '{mensaje}'")
print(f"👉 Enviando a: {url} ...")

try:
    r = requests.post(url, json=payload)
    if r.status_code == 200:
        print("✅ ÉXITO: Django recibió el mensaje.")
    else:
        print(f"❌ ERROR: Django respondió {r.status_code}")
except Exception as e:
    print(f"❌ ERROR DE CONEXIÓN: {e}")
    print("Asegúrate de que 'python manage.py runserver' esté corriendo.")