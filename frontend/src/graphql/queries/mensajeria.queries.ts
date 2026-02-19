import { gql } from '@apollo/client'; // O la librería que estés usando (urql, etc)

// 1. OBTENER LA LISTA DE CONTACTOS (Para la barra lateral)
export const GET_ESTUDIANTES_CHAT = gql`
  query GetEstudiantesChat {
    listaEstudiantes: estudiantes { # Alias 'listaEstudiantes'
      id
      nombre
      celular
      ultimoMensaje
      ultimoMensajeTipo
      activo
    }
  }
`;

// 2. OBTENER EL CHAT DE UNA PERSONA (Para el centro de la pantalla)
export const GET_DETALLE_CHAT = gql`
  query GetDetalleChat($id: ID!) {
    estudiante(id: $id) {
      id
      nombre
      celular
      carrera {
        nombre
      }
      historialChat {
        id
        texto
        tipo      # ENTRADA / SALIDA
        estado
        timestamp
      }
    }
  }
`;