import strawberry
from typing import Optional, List
from datetime import datetime  # <--- 1. IMPORTANTE: Agregamos esto
from ..models import Estudiante, Carrera, Facultad, HistorialEnvios, Mensaje

# --- DEFINICIONES BASE ---

@strawberry.type
class FacultadType:
    id: strawberry.ID
    nombre: str
    sigla: str

@strawberry.type
class CarreraType:
    id: strawberry.ID
    nombre: str
    facultad: FacultadType 

# --- TIPO: MENSAJE (Aquí estaba el error) ---
@strawberry.type
class MensajeType:
    id: strawberry.ID
    texto: str
    tipo: str       
    estado: str     
    # CORRECCIÓN: Cambiamos 'strawberry.auto' por 'datetime'
    timestamp: datetime 
    whatsapp_id: Optional[str]

# --- TIPO: ESTUDIANTE ---
@strawberry.type
class EstudianteType:
    id: strawberry.ID
    nombre: str
    celular: str
    activo: bool
    carrera: Optional[CarreraType]

    @strawberry.field
    def historial_chat(self) -> List[MensajeType]:
        return self.mensajes.all().order_by('timestamp')

    @strawberry.field
    def ultimo_mensaje(self) -> str:
        ultimo = self.mensajes.last()
        if ultimo:
            prefix = "Tú: " if ultimo.tipo == 'SALIDA' else ""
            texto = ultimo.texto[:30] + "..." if len(ultimo.texto) > 30 else ultimo.texto
            return f"{prefix}{texto}"
        return "Sin mensajes"
    
    # ... (imports anteriores)

@strawberry.type
class EstudianteType:
    id: strawberry.ID
    nombre: str
    celular: str
    activo: bool
    carrera: Optional[CarreraType]

    @strawberry.field
    def historial_chat(self) -> List[MensajeType]:
        return self.mensajes.all().order_by('timestamp')

    @strawberry.field
    def ultimo_mensaje(self) -> str:
        ultimo = self.mensajes.last()
        if ultimo:
            prefix = "Tú: " if ultimo.tipo == 'SALIDA' else ""
            texto = ultimo.texto[:30] + "..." if len(ultimo.texto) > 30 else ultimo.texto
            return f"{prefix}{texto}"
        return "Sin mensajes"

    @strawberry.field
    def ultimo_mensaje_tipo(self) -> Optional[str]:
        """Devuelve 'ENTRADA' o 'SALIDA' para saber quién habló último"""
        ultimo = self.mensajes.last()
        return ultimo.tipo if ultimo else None
    # --------------------

@strawberry.type
class HistorialEnvioType:
    id: strawberry.ID
    mensaje: str
    fecha_envio: str 
    cantidad_destinatarios: int
    filtro_aplicado: str