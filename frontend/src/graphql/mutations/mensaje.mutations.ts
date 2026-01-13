import { gql } from '@apollo/client';

export const ENVIAR_MASIVO = gql`
  # carreraId es opcional (no tiene !), si no se envía va a TODOS
  mutation EnviarAvisoMasivo($mensaje: String!, $carreraId: ID) {
    enviarAvisoMasivo(mensaje: $mensaje, carreraId: $carreraId)
  }
`;