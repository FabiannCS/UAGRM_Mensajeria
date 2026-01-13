import strawberry
from ..tasks import enviar_masivo_task
from ..models import Estudiante, Carrera  # Importamos Carrera para validar
from .types import EstudianteType

@strawberry.type
class MensajeriaMutations:
    
    # 1. ENVIAR MENSAJE (Ahora preparado para filtros)
    @strawberry.mutation
    def enviar_aviso_masivo(self, mensaje: str, carrera_id: strawberry.ID = None) -> str:
        if not mensaje:
            raise Exception("El mensaje no puede estar vacío")
        
        # Nota: Más adelante actualizaremos la 'task' para usar este carrera_id
        # Por ahora lo pasamos, aunque la tarea aún no lo use.
        task = enviar_masivo_task.delay(mensaje, carrera_id)
        return f"Proceso iniciado. ID: {task.id}"

    # 2. CREAR ESTUDIANTE (¡CORREGIDO!)
    @strawberry.mutation
    def crear_estudiante(self, nombre: str, celular: str, carrera_id: strawberry.ID) -> EstudianteType:
        
        # Validamos que la carrera exista antes de guardar
        if not Carrera.objects.filter(id=carrera_id).exists():
             raise Exception("El ID de carrera proporcionado no existe.")

        nuevo_estudiante = Estudiante.objects.create(
            nombre=nombre,
            celular=celular,
            carrera_id=carrera_id, # Usamos carrera_id directo para asignar la relación
            activo=True
        )
        return nuevo_estudiante
    
    # 3. ELIMINAR ESTUDIANTE (Se mantiene igual)
    @strawberry.mutation
    def eliminar_estudiante(self, id: strawberry.ID) -> str:
        try:
            estudiante = Estudiante.objects.get(pk=id)
            estudiante.delete()
            return "Estudiante eliminado correctamente"
        except Estudiante.DoesNotExist:
            raise Exception("El estudiante no existe")