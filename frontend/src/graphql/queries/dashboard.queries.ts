import { gql } from '@apollo/client';

// 1. QUERY PARA OBTENER LOS DATOS DEL DASHBOARD
export const GET_DASHBOARD_DATA = gql`
  # Agregamos las variables $limit y $offset
  query GetDashboardData($facultadId: ID, $carreraId: ID, $limit: Int, $offset: Int) {
    
    totalEstudiantes(facultadId: $facultadId, carreraId: $carreraId)
    totalMensajesEnviados
    
    # Pasamos las variables al historial
    historialEnvios(limit: $limit, offset: $offset) {
      id
      fechaEnvio
      mensaje
      cantidadDestinatarios
      filtroAplicado
    }
  }
`;

// 2. QUERY PARA LLENAR LOS FILTROS
export const GET_FILTROS_DASHBOARD = gql`
  query GetFiltrosDashboard {
    facultades {
      id
      nombre
      sigla
    }
    carreras {
      id
      nombre
      facultad {
        id
      }
    }
  }
`;