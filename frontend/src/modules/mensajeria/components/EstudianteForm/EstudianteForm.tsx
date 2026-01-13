import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { toast } from 'sonner';

// Importamos las Queries y Mutations
import { CREAR_ESTUDIANTE } from '../../../../graphql/mutations/estudiante.mutations';
import {  GET_CARRERAS } from '../../../../graphql/queries/estudiante.queries';

// --- DEFINICIÓN DE TIPOS (INTERFACES) ---
interface Carrera {
  id: string;
  nombre: string;
}

// Así es la respuesta que esperamos del servidor
interface CarrerasData {
  carreras: Carrera[];
}

export const EstudianteForm = () => {
  const [nombre, setNombre] = useState('');
  const [celular, setCelular] = useState('');
  const [carreraId, setCarreraId] = useState('');

  // CAMBIO: En lugar de <any>, usamos <CarrerasData>
  const { data: dataCarreras, loading: loadingCarreras } = useQuery<CarrerasData>(GET_CARRERAS);

// Busca esta parte:
  const [crearEstudiante, { loading: loadingMutation }] = useMutation(CREAR_ESTUDIANTE, {
  // CAMBIO CLAVE: Usamos el string 'GetEstudiantes' en lugar de la variable importada
  // Esto obliga a refrescar cualquier consulta que se llame así en toda la app
  refetchQueries: ['GetEstudiantes'], 
  
  onCompleted: () => {
    toast.success('Estudiante registrado correctamente');
    setNombre('');
    setCelular('');
    setCarreraId('');
  },
  onError: (error) => {
    toast.error(`Error: ${error.message}`);
  }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!carreraId) {
      toast.warning('Por favor selecciona una carrera');
      return;
    }

    crearEstudiante({
      variables: {
        nombre,
        celular,
        carreraId
      }
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Registrar Nuevo Estudiante</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
          <input 
            type="text" 
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Celular</label>
          <input 
            type="text" 
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            value={celular}
            onChange={(e) => setCelular(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Carrera</label>
          <select 
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white"
            value={carreraId}
            onChange={(e) => setCarreraId(e.target.value)}
            required
            disabled={loadingCarreras}
          >
            <option value="">-- Selecciona una carrera --</option>
            {loadingCarreras && <option disabled>Cargando carreras...</option>}
            
            {/* TypeScript ahora sabe que 'carrera' tiene id y nombre */}
            {dataCarreras?.carreras.map((carrera) => (
              <option key={carrera.id} value={carrera.id}>
                {carrera.nombre}
              </option>
            ))}
          </select>
        </div>

        <button 
          type="submit" 
          disabled={loadingMutation}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          {loadingMutation ? 'Guardando...' : 'Registrar Estudiante'}
        </button>

      </form>
    </div>
  );
};