import strawberry
from typing import Optional
from ..tasks import enviar_masivo_task
from ..models import Estudiante, Carrera, Mensaje
from .types import EstudianteType, MensajeType # Importamos MensajeType para el retorno
from ..services.whatsapp_service import enviar_mensaje_whatsapp # Necesitamos esto para que el mensaje salga al celular

@strawberry.type
class MensajeriaMutations:
    
    # --- 1. ENVIAR AVISO MASIVO (Marketing) ---
    @strawberry.mutation
    def enviar_aviso_masivo(self, mensaje: str, carrera_id: Optional[strawberry.ID] = None) -> str:
        if not mensaje:
            raise Exception("El mensaje no puede estar vacío")
        
        task = enviar_masivo_task.delay(mensaje, carrera_id)
        return f"Proceso iniciado. ID: {task.id}"

    # --- 2. ENVIAR RESPUESTA MANUAL (¡NUEVO E IMPORTANTE!) ---
    # Esto permite que TÚ respondas desde el Dashboard a un alumno específico
    @strawberry.mutation
    def enviar_respuesta_manual(self, estudiante_id: strawberry.ID, texto: str) -> MensajeType:
        if not texto:
             raise Exception("No puedes enviar un mensaje vacío.")

        try:
            estudiante = Estudiante.objects.get(pk=estudiante_id)
            
            # A) Guardamos en la Base de Datos (Como 'SALIDA' porque lo envías tú)
            nuevo_mensaje = Mensaje.objects.create(
                estudiante=estudiante,
                texto=texto,
                tipo='SALIDA',
                estado='ENVIADO'
            )
            
            # B) Enviamos el mensaje real a WhatsApp
            enviar_mensaje_whatsapp(estudiante.celular, texto)
            
            return nuevo_mensaje

        except Estudiante.DoesNotExist:
            raise Exception("El estudiante no existe.")
        except Exception as e:
            raise Exception(f"Error al enviar mensaje: {str(e)}")

    # --- 3. CREAR ESTUDIANTE (Corregido con Apellido) ---
    @strawberry.mutation
    def crear_estudiante(self, nombre: str, apellido: str, celular: str, carrera_id: strawberry.ID) -> EstudianteType:
        
        if not Carrera.objects.filter(id=carrera_id).exists():
             raise Exception("El ID de carrera proporcionado no existe.")

        # Verificamos si ya existe el celular para evitar error de duplicado
        if Estudiante.objects.filter(celular=celular).exists():
            raise Exception("Ya existe un estudiante con este número de celular.")

        nuevo_estudiante = Estudiante.objects.create(
            nombre=nombre,
            apellido=apellido, # Agregamos el apellido
            celular=celular,
            carrera_id=carrera_id,
            activo=True
        )
        return nuevo_estudiante
    
    # --- 4. ELIMINAR ESTUDIANTE ---
    @strawberry.mutation
    def eliminar_estudiante(self, id: strawberry.ID) -> str:
        try:
            estudiante = Estudiante.objects.get(pk=id)
            estudiante.delete()
            return "Estudiante eliminado correctamente"
        except Estudiante.DoesNotExist:
            raise Exception("El estudiante no existe")