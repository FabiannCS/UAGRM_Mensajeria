import { gql } from '@apollo/client';

// 1. QUERY PARA OBTENER LOS DATOS DEL DASHBOARD (FILTRADOS)
export const GET_DASHBOARD_DATA = gql`
  query GetDashboardData($facultadId: ID, $carreraId: ID) {
    # Enviamos los filtros al backend
    totalEstudiantes(facultadId: $facultadId, carreraId: $carreraId)
    
    # Estos siguen siendo globales
    totalMensajesEnviados
    
    historialEnvios {
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