import { gql } from '@apollo/client';

export const CREAR_ESTUDIANTE = gql`
  # Recibimos carreraId como ID obligatorio (!)
  mutation CrearEstudiante($nombre: String!, $celular: String!, $carreraId: ID!) {
    crearEstudiante(nombre: $nombre, celular: $celular, carreraId: $carreraId) {
      id
      nombre
      # Podemos pedir la carrera de vuelta para actualizar la tabla al instante
      carrera {
        nombre
      }
    }
  }
`;