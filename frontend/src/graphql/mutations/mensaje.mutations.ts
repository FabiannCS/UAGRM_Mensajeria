import { gql } from '@apollo/client';

export const ENVIAR_AVISO_MASIVO = gql`
  mutation EnviarAviso($mensaje: String!) {
    enviarAvisoMasivo(mensaje: $mensaje)
  }
`;