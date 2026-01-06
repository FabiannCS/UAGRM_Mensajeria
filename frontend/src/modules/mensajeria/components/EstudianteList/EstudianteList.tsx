import { useQuery, useMutation } from '@apollo/client/react';
import { GET_ESTUDIANTES } from '../../graphql/queries';
import { ELIMINAR_ESTUDIANTE } from '../../../../graphql/mutations/eliminar.mutations'; // Verifica que la ruta sea correcta
import { toast } from 'sonner'; // <--- IMPORTACIÓN DE LA ALERTA

interface Estudiante {
  id: string;
  nombre: string;
  celular: string;
  carrera: string;
  activo: boolean;
}

interface EstudiantesData {
  estudiantes: Estudiante[];
}

export const EstudianteList = () => {
  const { loading, error, data } = useQuery<EstudiantesData>(GET_ESTUDIANTES);

  const [eliminarEstudiante] = useMutation(ELIMINAR_ESTUDIANTE, {
    refetchQueries: [{ query: GET_ESTUDIANTES }],
  });

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar a este estudiante?')) {
      try {
        await eliminarEstudiante({ variables: { id } });
        toast.success('Estudiante eliminado correctamente'); // <--- ALERTA DE ÉXITO
      } catch (err) {
        console.error(err);
        toast.error('Error al eliminar el estudiante'); // <--- ALERTA DE ERROR
      }
    }
  };

  if (loading) return <p style={{ textAlign: 'center', color: '#666' }}>Cargando estudiantes...</p>;
  if (error) return <p style={{ textAlign: 'center', color: 'red' }}>Error: {error.message}</p>;
  if (!data || !data.estudiantes) return <p>No hay datos disponibles.</p>;

  return (
    <div style={{ marginTop: '10px' }}>
      <h2 style={{ borderBottom: '2px solid var(--primary)', paddingBottom: '10px', color: 'var(--primary)', textAlign: 'center' }}>
        📋 Lista de Destinatarios ({data.estudiantes.length})
      </h2>

      <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #eee' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'sans-serif', minWidth: '600px' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--primary)', color: '#ffffff', textAlign: 'left' }}>
              <th style={{ padding: '12px 15px' }}>Nombre Completo</th>
              <th style={{ padding: '12px 15px' }}>Celular</th>
              <th style={{ padding: '12px 15px' }}>Carrera</th>
              <th style={{ padding: '12px 15px', textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.estudiantes.map((est: Estudiante, index: number) => (
              <tr 
                key={est.id} 
                style={{ 
                  borderBottom: '1px solid #dddddd', 
                  backgroundColor: index % 2 === 0 ? '#f8f9fa' : '#fff',
                  transition: '0.3s'
                }}
              >
                <td style={{ padding: '12px 15px', fontWeight: 'bold', color: '#555' }}>{est.nombre}</td>
                <td style={{ padding: '12px 15px' }}>🇧🇴 {est.celular}</td>
                <td style={{ padding: '12px 15px' }}>
                  <span style={{ 
                    background: '#e3f2fd', color: '#1565c0', 
                    padding: '4px 8px', borderRadius: '12px', fontSize: '0.85em', fontWeight: '500' 
                  }}>
                    {est.carrera}
                  </span>
                </td>
                <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                  <button
                    onClick={() => handleDelete(est.id)}
                    className="btn"
                    style={{
                      background: '#ff5252',
                      color: 'white',
                      padding: '6px 12px',
                      fontSize: '0.85em'
                    }}
                  >
                    🗑️ Borrar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};