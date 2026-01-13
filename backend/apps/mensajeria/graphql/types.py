import strawberry
from typing import Optional, List
from ..models import Estudiante, Carrera, Facultad, HistorialEnvios

# 1. Definimos la Facultad primero (La "abuela" de la relación)
@strawberry.type
class FacultadType:
    id: strawberry.ID
    nombre: str
    sigla: str

# 2. Definimos la Carrera (La "madre")
@strawberry.type
class CarreraType:
    id: strawberry.ID
    nombre: str
    # Relación: Una carrera tiene una facultad
    facultad: FacultadType 

# 3. Actualizamos Estudiante (El "hijo")
@strawberry.type
class EstudianteType:
    id: strawberry.ID
    nombre: str
    celular: str
    activo: bool
    
    # Ahora es: Un objeto CarreraType (y puede ser null/Optional)
    carrera: Optional[CarreraType]

# 4. Tipo para el Historial de Envios
@strawberry.type
class HistorialEnvioType:
    id: strawberry.ID
    mensaje: str
    fecha_envio: str # Strawberry maneja fechas, pero str es facil para empezar
    cantidad_destinatarios: int
    filtro_aplicado: str