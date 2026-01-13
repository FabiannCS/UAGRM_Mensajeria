import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { toast } from 'sonner';
// Asegúrate de importar GET_CARRERAS también
import { GET_ESTUDIANTES, GET_CARRERAS } from '../../../../graphql/queries/estudiante.queries';
import { ELIMINAR_ESTUDIANTE } from '../../../../graphql/mutations/eliminar.mutations';

// --- INTERFACES ---
interface Carrera { id: string; nombre: string; }
interface Estudiante { id: string; nombre: string; celular: string; activo: boolean; carrera?: { id?: string; nombre?: string; facultad?: { sigla?: string } } }
interface EstudiantesData { estudiantes: Estudiante[] }
interface EstudiantesVars { limit: number; offset: number; carreraId?: string | null }
interface CarrerasData { carreras: Carrera[]; }

export const EstudianteList = () => {
  const TAMANO_PAGINA = 5;
  const [pagina, setPagina] = useState(0);
  const [filtroCarrera, setFiltroCarrera] = useState(""); // Estado para el filtro
  
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // 1. Cargar Carreras para el Filtro
  const { data: dataCarreras } = useQuery<CarrerasData>(GET_CARRERAS);

  // 2. Cargar Estudiantes (Con el filtro aplicado)
  const { data, loading, error } = useQuery<EstudiantesData, EstudiantesVars>(GET_ESTUDIANTES, {
    variables: {
      limit: TAMANO_PAGINA,
      offset: pagina * TAMANO_PAGINA,
      carreraId: filtroCarrera || null // Si está vacío, mandamos null
    },
    fetchPolicy: "network-only"
  });
  
  // Normalizamos para evitar undefined al acceder a propiedades
  const estudiantes = data?.estudiantes ?? [];
  const esUltimaPagina = estudiantes.length < TAMANO_PAGINA;

  const [eliminarEstudiante] = useMutation(ELIMINAR_ESTUDIANTE, {
    refetchQueries: ['GetEstudiantes'], 
    onError: (err) => toast.error(err.message)
  });



  // Scroll suave al cambiar página
  useEffect(() => {
    if (tableContainerRef.current) tableContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pagina]);

  const siguientePagina = () => setPagina(pagina + 1);
  const anteriorPagina = () => { if (pagina > 0) setPagina(pagina - 1); };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-fadeIn">
      
      {/* HEADER CON FILTRO */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-gray-800">Directorio de Estudiantes</h2>
        
        {/* SELECTOR DE FILTRO */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Filtrar por:</span>
          <select 
            className="p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none bg-gray-50"
            value={filtroCarrera}
            onChange={(e) => { setFiltroCarrera(e.target.value); setPagina(0); }}
          >
            <option value=""> Ver Todas las Carreras</option>
            {dataCarreras?.carreras.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* TABLA DE RESULTADOS */}
      <div ref={tableContainerRef} className="overflow-x-auto rounded-lg border border-gray-100 max-h-500px">
        {/* ... (Aquí va el mismo código de la <table> que ya tenías, no cambia nada interno) ... */}
        {/* COPIA AQUÍ TU CÓDIGO DE <TABLE> DEL PASO ANTERIOR */}
        {loading && <div className="p-8 text-center text-gray-500">Cargando...</div>}
        {error && <div className="p-4 text-red-500">Error: {error.message}</div>}
        
        {!loading && !error && (
            <table className="w-full text-sm text-left text-gray-500">
             {/* ... headers y body ... usa data?.estudiantes.map ... */}
             {/* Es importante que copies la tabla del mensaje anterior para no perderla */}
             <thead className="text-xs text-gray-700 uppercase bg-gray-50/50 sticky top-0 backdrop-blur-sm z-10">
                <tr>
                    <th className="px-6 py-3 bg-gray-50/90">Nombre</th>
                    <th className="px-6 py-3 bg-gray-50/90">Celular</th>
                    <th className="px-6 py-3 bg-gray-50/90">Carrera</th>
                    <th className="px-6 py-3 bg-gray-50/90 text-center">Estado</th>
                    <th className="px-6 py-3 bg-gray-50/90 text-right">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {estudiantes.map((est) => (
                    <tr key={est.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{est.nombre}</td>
                        <td className="px-6 py-4">{est.celular}</td>
                        <td className="px-6 py-4">{est.carrera?.nombre}</td>
                        <td className="px-6 py-4 text-center">{est.activo ? '✅' : '🔴'}</td>
                        <td className="px-6 py-4 text-right">
                            <button onClick={() => eliminarEstudiante({ variables: { id: est.id }})} className="text-red-600 hover:underline">Eliminar</button>
                        </td>
                    </tr>
                ))}
            </tbody>
            </table>
        )}
      </div>

      {/* PAGINACIÓN */}
      <div className="flex justify-between items-center mt-4">
        <button onClick={anteriorPagina} disabled={pagina === 0} className="px-4 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50">← Anterior</button>
        <span className="text-xs text-gray-400">Página {pagina + 1}</span>
        <button onClick={siguientePagina} disabled={esUltimaPagina} className="px-4 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50">Siguiente →</button>
      </div>
    </div>
  );
};