import { gql } from '@apollo/client';

export const ENVIAR_MASIVO = gql`
  # carreraId es opcional (no tiene !), si no se envía va a TODOS
  mutation EnviarAvisoMasivo($mensaje: String!, $carreraId: ID) {
    enviarAvisoMasivo(mensaje: $mensaje, carreraId: $carreraId)
  }
`;
export const ENVIAR_RESPUESTA_MANUAL = gql`
  mutation EnviarRespuestaManual($estudianteId: ID!, $texto: String!) {
    enviarRespuestaManual(estudianteId: $estudianteId, texto: $texto) {
      id
      texto
      tipo
      timestamp
    }
  }
`;