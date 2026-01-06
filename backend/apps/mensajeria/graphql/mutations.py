import strawberry
from ..tasks import enviar_masivo_task
from ..models import Estudiante
from .types import EstudianteType  # Importamos el tipo que creamos arriba

@strawberry.type
class MensajeriaMutations:
    
    # 1. ENVIAR MENSAJE
    @strawberry.mutation
    def enviar_aviso_masivo(self, mensaje: str) -> str:
        if not mensaje:
            raise Exception("El mensaje no puede estar vacío")
        
        task = enviar_masivo_task.delay(mensaje)
        return f"Proceso iniciado correctamente. ID de tarea: {task.id}"

    # 2. CREAR ESTUDIANTE
    @strawberry.mutation
    def crear_estudiante(self, nombre: str, celular: str, carrera: str) -> EstudianteType:
        nuevo_estudiante = Estudiante.objects.create(
            nombre=nombre,
            celular=celular,
            carrera=carrera,
            activo=True
        )
        return nuevo_estudiante
    
    # 3. ELIMINAR ESTUDIANTE
    @strawberry.mutation
    def eliminar_estudiante(self, id: strawberry.ID) -> str:
        try:
            estudiante = Estudiante.objects.get(pk=id)
            estudiante.delete()
            return "Estudiante eliminado correctamente"
        except Estudiante.DoesNotExist:
            raise Exception("El estudiante no existe")