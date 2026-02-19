import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_DASHBOARD_DATA, GET_FILTROS_DASHBOARD } from '../../../../graphql/queries/dashboard.queries';

interface HistorialItem {
  id: string;
  fechaEnvio: string;
  mensaje: string;
  cantidadDestinatarios: number;
  filtroAplicado: string;
}

interface DashboardData {
  totalEstudiantes: number;
  totalMensajesEnviados: number;
  historialEnvios: HistorialItem[];
}

interface Facultad {
  id: string;
  nombre: string;
  sigla: string;
}

interface Carrera {
  id: string;
  nombre: string;
  facultad: {
    id: string;
  };
}

interface FiltrosData {
  facultades: Facultad[];
  carreras: Carrera[];
}

export const Dashboard = () => {
  // ESTADOS DE FILTROS
  const [filtroFacultad, setFiltroFacultad] = useState("");
  const [filtroCarrera, setFiltroCarrera] = useState("");
  
  // NUEVO: ESTADO DE PAGINACIÓN
  const [pagina, setPagina] = useState(0);
  const TAMANO_PAGINA = 5;

  // 1. Cargar Filtros
  const { data: dataFiltros } = useQuery<FiltrosData>(GET_FILTROS_DASHBOARD);

  // 2. Cargar Dashboard con Paginación
  const { data, loading, error } = useQuery<DashboardData>(GET_DASHBOARD_DATA, {
    variables: {
      facultadId: filtroFacultad || null,
      carreraId: filtroCarrera || null,
      limit: TAMANO_PAGINA,         // <--- Enviamos límite
      offset: pagina * TAMANO_PAGINA // <--- Calculamos salto
    },
    pollInterval: 5000,
    fetchPolicy: 'network-only'
  });

  const carrerasDisponibles: Carrera[] = (dataFiltros?.carreras ?? []).filter((c: Carrera) => 
    filtroFacultad ? c.facultad.id === filtroFacultad : true
  );

  // Funciones de navegación
  const siguientePagina = () => setPagina(pagina + 1);
  const anteriorPagina = () => { if (pagina > 0) setPagina(pagina - 1); };

  if (loading && !data) return <div className="p-8 text-center text-gray-500 animate-pulse">Cargando datos...</div>;
  if (error) return <div className="p-4 bg-red-50 text-red-600 rounded-lg">Error: {error.message}</div>;

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* BARRA DE FILTROS DE AUDITORÍA */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
          </svg>
          <span className="font-bold text-sm uppercase tracking-wide">Auditoría:</span>
        </div>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <select 
            className="p-2 border border-gray-300 rounded-lg text-sm bg-gray-50 min-w-200px"
            value={filtroFacultad}
            onChange={(e) => { setFiltroFacultad(e.target.value); setFiltroCarrera(""); }}
          >
            <option value="">🏢 Todas las Facultades</option>
            {dataFiltros?.facultades?.map((f) => (
              <option key={f.id} value={f.id}>{f.sigla} - {f.nombre}</option>
            ))}
          </select>

          <select 
            className="p-2 border border-gray-300 rounded-lg text-sm bg-gray-50 min-w-200px"
            value={filtroCarrera}
            onChange={(e) => setFiltroCarrera(e.target.value)}
            disabled={!carrerasDisponibles?.length}
          >
            <option value="">🎓 {filtroFacultad ? 'Todas las carreras' : 'Todas las Carreras'}</option>
            {carrerasDisponibles.map((c: Carrera) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
          
          {(filtroFacultad || filtroCarrera) && (
            <button onClick={() => { setFiltroFacultad(""); setFiltroCarrera(""); }} className="text-xs text-red-500 hover:underline">Limpiar</button>
          )}
        </div>
      </div>

      {/* TARJETAS DE KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Estudiantes Filtrados</p>
            <h3 className="text-4xl font-bold text-primary mt-1">{data?.totalEstudiantes || 0}</h3>
            <p className="text-xs text-gray-400 mt-2">Registros activos</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-full text-blue-600">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Mensajes Totales</p>
            <h3 className="text-4xl font-bold text-gray-800 mt-1">{data?.totalMensajesEnviados || 0}</h3>
            <p className="text-xs text-gray-400 mt-2">Histórico global</p>
          </div>
          <div className="p-4 bg-green-50 rounded-full text-green-600">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          </div>
        </div>
      </div>

      {/* --- HISTORIAL CON PAGINACIÓN --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">Últimos Movimientos</h3>
          <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-600">Página {pagina + 1}</span>
        </div>
        
        <div className="overflow-x-auto min-h-200px">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Fecha</th>
                <th className="px-6 py-3">Filtro</th>
                <th className="px-6 py-3">Mensaje</th>
                <th className="px-6 py-3 text-center">Cant.</th>
              </tr>
            </thead>
            <tbody>
              {(data?.historialEnvios ?? []).map((envio: HistorialItem) => (
                <tr key={envio.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(envio.fechaEnvio).toLocaleDateString()}
                    <span className="text-xs text-gray-400 block">{new Date(envio.fechaEnvio).toLocaleTimeString()}</span>
                  </td>
                  <td className="px-6 py-4 font-medium text-blue-600">
                    {envio.filtroAplicado}
                  </td>
                  <td className="px-6 py-4 max-w-xs truncate" title={envio.mensaje}>
                    {envio.mensaje}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2 py-1 bg-gray-100 rounded text-gray-800 font-bold text-xs">
                      {envio.cantidadDestinatarios}
                    </span>
                  </td>
                </tr>
              ))}
              
              {/* Mensaje si está vacío */}
              {(data?.historialEnvios ?? []).length === 0 && (
                 <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400">No hay más registros.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* BOTONES DE PAGINACIÓN */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
          <button 
            onClick={anteriorPagina} 
            disabled={pagina === 0}
            className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Anterior
          </button>
          
          <button 
            onClick={siguientePagina} 
            // Deshabilitamos si hay menos elementos que el tamaño de página (significa que es el final)
            disabled={((data?.historialEnvios ?? []).length) < TAMANO_PAGINA}
            className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente →
          </button>
        </div>
      </div>

    </div>
  );
};