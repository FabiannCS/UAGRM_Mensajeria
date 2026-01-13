import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_DASHBOARD_DATA, GET_FILTROS_DASHBOARD } from '../../../../graphql/queries/dashboard.queries';

// Interfaces
interface HistorialItem {
  id: string;
  fechaEnvio: string;
  mensaje: string;
  cantidadDestinatarios: number;
  filtroAplicado: string;
}

interface DashboardData {
  totalEstudiantes: number; // Este número ahora cambia dinámicamente
  totalMensajesEnviados: number;
  historialEnvios: HistorialItem[];
}

// Interfaces para los filtros (Facultades / Carreras)
interface Facultad { id: string; nombre: string; sigla: string }
interface Carrera { id: string; nombre: string; facultad: { id: string } }
interface FiltrosData { facultades: Facultad[]; carreras: Carrera[] }

export const Dashboard = () => {
  // ESTADOS PARA LOS FILTROS
  const [filtroFacultad, setFiltroFacultad] = useState("");
  const [filtroCarrera, setFiltroCarrera] = useState("");

  // 1. CARGAMOS LAS LISTAS PARA LOS SELECTORES (Facultades y Carreras)
  const { data: dataFiltros } = useQuery<FiltrosData>(GET_FILTROS_DASHBOARD);

  // 2. CARGAMOS LOS DATOS DEL DASHBOARD (Aplicando los filtros)
  const { data, loading, error } = useQuery<DashboardData>(GET_DASHBOARD_DATA, {
    variables: {
      facultadId: filtroFacultad || null,
      carreraId: filtroCarrera || null
    },
    pollInterval: 5000,
    fetchPolicy: 'network-only'
  });

  // Lógica para filtrar las carreras según la facultad seleccionada
  // Usamos un fallback a [] para evitar acceder a .filter sobre undefined
  const carrerasDisponibles = (dataFiltros?.carreras ?? []).filter((c: Carrera) => 
    filtroFacultad ? c.facultad.id === filtroFacultad : true
  );

  if (loading && !data) return <div className="p-8 text-center text-gray-500 animate-pulse">Analizando datos...</div>;
  if (error) return <div className="p-4 bg-red-50 text-red-600 rounded-lg">Error: {error.message}</div>;

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* --- BARRA DE HERRAMIENTAS DE AUDITORÍA --- */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        
        <div className="flex items-center gap-2 text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
          </svg>
          <span className="font-bold text-sm uppercase tracking-wide">Filtros de Auditoría:</span>
        </div>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          
          {/* 1. SELECTOR DE FACULTAD */}
          <select 
            className="p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none bg-gray-50 min-w-200px"
            value={filtroFacultad}
            onChange={(e) => {
              setFiltroFacultad(e.target.value);
              setFiltroCarrera(""); // Resetear carrera al cambiar facultad
            }}
          >
            <option value="">🏢 Todas las Facultades</option>
            {dataFiltros?.facultades.map((f: Facultad) => (
              <option key={f.id} value={f.id}>{f.sigla} - {f.nombre}</option>
            ))}
          </select>

          {/* 2. SELECTOR DE CARRERA */}
          <select 
            className="p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none bg-gray-50 min-w-200px"
            value={filtroCarrera}
            onChange={(e) => setFiltroCarrera(e.target.value)}
            disabled={!carrerasDisponibles?.length}
          >
            <option value="">🎓 {filtroFacultad ? 'Todas las carreras de esta facultad' : 'Todas las Carreras'}</option>
            {carrerasDisponibles?.map((c: Carrera) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
          
          {/* BOTÓN LIMPIAR */}
          {(filtroFacultad || filtroCarrera) && (
            <button 
              onClick={() => { setFiltroFacultad(""); setFiltroCarrera(""); }}
              className="text-xs text-red-500 hover:text-red-700 font-medium underline"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* --- TARJETAS DE KPIs --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* KPI: Estudiantes (DINÁMICO) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between transition-all hover:shadow-md">
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">
              {filtroCarrera ? 'Estudiantes en Carrera' : (filtroFacultad ? 'Estudiantes en Facultad' : 'Total Global Estudiantes')}
            </p>
            <h3 className="text-4xl font-bold text-primary mt-1 animate-pulse-once">
              {data?.totalEstudiantes || 0}
            </h3>
            <p className="text-xs text-gray-400 mt-2">
              Registros activos en base de datos
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-full text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
          </div>
        </div>

        {/* KPI: Mensajes (GLOBAL) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Total Mensajes Enviados</p>
            <h3 className="text-4xl font-bold text-gray-800 mt-1">{data?.totalMensajesEnviados || 0}</h3>
            <p className="text-xs text-gray-400 mt-2">Histórico acumulado</p>
          </div>
          <div className="p-4 bg-green-50 rounded-full text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0 1 21.485 12 59.77 59.77 0 0 1 3.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </div>
        </div>
      </div>

      {/* --- HISTORIAL (Sin cambios) --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">Últimos Mensajes Enviados</h3>
          <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-600">Global</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Fecha</th>
                <th className="px-6 py-3">Filtro Aplicado</th>
                <th className="px-6 py-3">Mensaje</th>
                <th className="px-6 py-3 text-center">Enviados</th>
              </tr>
            </thead>
            <tbody>
              {data?.historialEnvios.map((envio) => (
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};