import strawberry
from typing import List
from ..models import Estudiante
from .types import EstudianteType       # Importamos el Tipo
from .mutations import MensajeriaMutations # Importamos Mutaciones

# Definimos la Query (Lectura) aquí porque es corta
@strawberry.type
class Query:
    @strawberry.field
    def estudiantes(self) -> List[EstudianteType]:
        return Estudiante.objects.all()

# Definimos la Mutation heredando de la clase que creamos en el otro archivo
@strawberry.type
class Mutation(MensajeriaMutations):
    pass