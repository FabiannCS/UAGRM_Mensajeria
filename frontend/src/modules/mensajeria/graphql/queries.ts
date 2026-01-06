import { gql } from '@apollo/client';

export const GET_ESTUDIANTES = gql`
  query ObtenerEstudiantes {
    estudiantes {
      id
      nombre
      celular
      carrera
      activo
    }
  }
`;