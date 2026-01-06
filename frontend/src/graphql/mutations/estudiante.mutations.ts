import { gql } from '@apollo/client';

export const CREAR_ESTUDIANTE = gql`
  mutation CrearEstudiante($nombre: String!, $celular: String!, $carrera: String!) {
    crearEstudiante(nombre: $nombre, celular: $celular, carrera: $carrera) {
      id
      nombre
      celular
      carrera
    }
  }
`;