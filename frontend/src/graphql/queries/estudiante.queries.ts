import { gql } from '@apollo/client';

export const GET_ESTUDIANTES = gql`
  # Agregamos $carreraId como variable opcional
  query GetEstudiantes($limit: Int, $offset: Int, $carreraId: ID) {
    estudiantes(limit: $limit, offset: $offset, carreraId: $carreraId) {
      id
      nombre
      celular
      activo
      carrera {
        id
        nombre
        facultad { sigla }
      }
    }
  }
`;

export const GET_CARRERAS = gql`
  query GetCarreras {
    carreras {
      id
      nombre
    }
  }
`;