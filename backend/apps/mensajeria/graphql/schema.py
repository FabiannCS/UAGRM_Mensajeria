import strawberry
from typing import List, Optional
from ..models import Estudiante, Carrera, Facultad, HistorialEnvios # <--- 1. Importamos los nuevos modelos
from .types import EstudianteType, CarreraType, FacultadType, HistorialEnvioType  # <--- 2. Importamos los nuevos Tipos
from .mutations import MensajeriaMutations

@strawberry.type
class Query:
    # --- Consulta de Estudiantes ---
    # Agregamos el parámetro carrera_id para filtrar por carrera
    @strawberry.field
    def estudiantes(self, limit: int = 10, offset: int = 0, carrera_id: Optional[strawberry.ID] = None) -> List[EstudianteType]:
        
        # Lógica de consulta
        queryset = Estudiante.objects.select_related('carrera').all().order_by('-id')
        
        # Solo filtramos si carrera_id tiene un valor real
        if carrera_id:
            queryset = queryset.filter(carrera_id=carrera_id)
            
        return queryset[offset:offset+limit]

    # --- NUEVA: Consulta de Carreras (Para el Select del Formulario) ---
    @strawberry.field
    def carreras(self) -> List[CarreraType]:
        # Ordenamos por nombre para que el menú se vea ordenado alfabéticamente
        return Carrera.objects.all().order_by('nombre')

    # --- Consulta de Facultades (Opcional, pero útil) ---
    @strawberry.field
    def facultades(self) -> List[FacultadType]:
        return Facultad.objects.all()
    
    # --- NUEVA: Consulta de Historial de Envios ---
    @strawberry.field
    def historial_envios(self) -> List[HistorialEnvioType]:
        # Devolvemos los últimos 10 envíos, ordenados del más reciente al más antiguo
        return HistorialEnvios.objects.all().order_by('-fecha_envio')[:10]

    @strawberry.field
    def total_estudiantes(self, facultad_id: Optional[strawberry.ID] = None, carrera_id: Optional[strawberry.ID] = None) -> int:
        # Empezamos con todos los activos
        queryset = Estudiante.objects.filter(activo=True)
        
        # Filtro Específico: Si hay Carrera, mandan la carrera
        if carrera_id:
            queryset = queryset.filter(carrera_id=carrera_id)
        # Filtro General: Si solo hay Facultad, buscamos estudiantes de esa facultad
        elif facultad_id:
            queryset = queryset.filter(carrera__facultad_id=facultad_id)
            
        return queryset.count()
        
    @strawberry.field
    def total_mensajes_enviados(self) -> int:
        # Sumamos todos los destinatarios de todos los envíos
        todos = HistorialEnvios.objects.all()
        return sum(envio.cantidad_destinatarios for envio in todos)

# La Mutación se mantiene igual
@strawberry.type
class Mutation(MensajeriaMutations):
    pass