import strawberry
from typing import List, Optional
from ..models import Estudiante, Carrera, Facultad, HistorialEnvios
# IMPORTANTE: Agregamos MensajeType a los imports
from .types import EstudianteType, CarreraType, FacultadType, HistorialEnvioType, MensajeType
from .mutations import MensajeriaMutations

@strawberry.type
class Query:
    # --- Consulta de Estudiantes (LISTA GENERAL) ---
    @strawberry.field
    def estudiantes(self, limit: int = 10, offset: int = 0, carrera_id: Optional[strawberry.ID] = None) -> List[EstudianteType]:
        
        # Usamos select_related para optimizar la carga de la carrera
        queryset = Estudiante.objects.select_related('carrera').all().order_by('-id')
        
        if carrera_id:
            queryset = queryset.filter(carrera_id=carrera_id)
            
        return queryset[offset:offset+limit]

    # --- NUEVA: Consulta de UN Estudiante (Para abrir el Chat Individual) ---
    @strawberry.field
    def estudiante(self, id: strawberry.ID) -> Optional[EstudianteType]:
        try:
            return Estudiante.objects.get(pk=id)
        except Estudiante.DoesNotExist:
            return None

    # --- Consulta de Carreras ---
    @strawberry.field
    def carreras(self) -> List[CarreraType]:
        return Carrera.objects.all().order_by('nombre')

    # --- Consulta de Facultades ---
    @strawberry.field
    def facultades(self) -> List[FacultadType]:
        return Facultad.objects.all()
    
    # --- Consulta de Historial de Envios ---
    @strawberry.field
    def historial_envios(self, limit: int = 5, offset: int = 0) -> List[HistorialEnvioType]:
        return HistorialEnvios.objects.all().order_by('-fecha_envio')[offset:offset+limit]

    # --- Estadísticas: Total Estudiantes ---
    @strawberry.field
    def total_estudiantes(self, facultad_id: Optional[strawberry.ID] = None, carrera_id: Optional[strawberry.ID] = None) -> int:
        queryset = Estudiante.objects.filter(activo=True)
        
        if carrera_id:
            queryset = queryset.filter(carrera_id=carrera_id)
        elif facultad_id:
            queryset = queryset.filter(carrera__facultad_id=facultad_id)
            
        return queryset.count()
        
    # --- Estadísticas: Total Mensajes Enviados ---
    @strawberry.field
    def total_mensajes_enviados(self) -> int:
        todos = HistorialEnvios.objects.all()
        return sum(envio.cantidad_destinatarios for envio in todos)

# La Mutación se mantiene igual
@strawberry.type
class Mutation(MensajeriaMutations):
    pass