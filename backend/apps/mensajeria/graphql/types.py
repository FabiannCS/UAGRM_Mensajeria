import strawberry
from ..models import Estudiante

# Usamos definición explícita para tener control total de los datos
@strawberry.type
class EstudianteType:
    id: strawberry.ID
    nombre: str      # Aquí asumimos que el nombre completo va en este campo
    celular: str
    carrera: str
    activo: bool