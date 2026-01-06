import { gql } from '@apollo/client';

export const ELIMINAR_ESTUDIANTE = gql`
  mutation EliminarEstudiante($id: ID!) {
    eliminarEstudiante(id: $id)
  }
`;