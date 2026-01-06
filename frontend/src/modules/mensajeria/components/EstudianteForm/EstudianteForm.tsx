import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { CREAR_ESTUDIANTE } from '../../../../graphql/mutations/estudiante.mutations';
import { GET_ESTUDIANTES } from '../../graphql/queries';
import { toast } from 'sonner';

export const EstudianteForm = () => {
  // Estados para los inputs
  const [nombre, setNombre] = useState('');
  const [celular, setCelular] = useState('');
  const [carrera, setCarrera] = useState('');

  // Hook de mutación
  // refetchQueries: Sirve para que cuando crees uno nuevo, la lista se actualice sola
  const [crearEstudiante, { loading, error }] = useMutation(CREAR_ESTUDIANTE, {
    refetchQueries: [{ query: GET_ESTUDIANTES }] 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validación con mensaje de advertencia (Amarillo)
    if (!nombre || !celular || !carrera) {
        toast.warning("Por favor, llena todos los campos");
        return;
    }

    try {
      await crearEstudiante({ variables: { nombre, celular, carrera } });
      setNombre('');
      setCelular('');
      setCarrera('');
      
      // ÉXITO (Verde)
      toast.success("¡Estudiante registrado correctamente!");
    } catch (err) {
      console.error(err);
      // ERROR (Rojo)
      toast.error("Error al registrar estudiante");
    }
  };

  return (
    <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #dee2e6' }}>
      <h3 style={{ marginTop: 0, color: '#495057', textAlign: 'center', paddingBottom: '10px'}}>Registrar Nuevo Estudiante</h3>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="Nombre Completo" 
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', flex: 1 }}
        />
        
        <input 
          type="text" 
          placeholder="Celular (ej: 591700...)" 
          value={celular}
          onChange={(e) => setCelular(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', flex: 1 }}
        />

        <input 
          type="text" 
          placeholder="Carrera" 
          value={carrera}
          onChange={(e) => setCarrera(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', flex: 1 }}
        />

        <button 
          type="submit" 
          disabled={loading}
          style={{
            background: '#28a745',
            color: 'white',
            border: 'none',
            padding: '8px 15px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
      </form>
      
      {error && <p style={{ color: 'red', fontSize: '0.9em' }}>Error: {error.message}</p>}
    </div>
  );
};