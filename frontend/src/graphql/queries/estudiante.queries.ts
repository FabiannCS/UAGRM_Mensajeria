import { gql } from '@apollo/client';

export const GET_ESTUDIANTES = gql`
  query GetEstudiantes {
    estudiantes {
      id
      nombre
      apellido
      celular
      carrera
      activo
    }
  }
`;