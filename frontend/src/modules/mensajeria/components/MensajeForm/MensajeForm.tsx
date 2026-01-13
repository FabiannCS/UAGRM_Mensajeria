import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { toast } from 'sonner';

// Importamos desde la ruta centralizada
import { ENVIAR_MASIVO } from '../../../../graphql/mutations/mensaje.mutations';
import { GET_CARRERAS } from '../../../../graphql/queries/estudiante.queries';

// --- INTERFACES PARA EVITAR ERRORES DE TIPO ---
interface Carrera {
  id: string;
  nombre: string;
}

interface CarrerasData {
  carreras: Carrera[];
}
// Lo que nos devuelve el servidor al enviar el mensaje
interface EnviarMasivoData {
  enviarAvisoMasivo: string; // Es el string que dice "Proceso iniciado..."
}

export const MensajeForm = () => {
  const [mensaje, setMensaje] = useState('');
  const [carreraId, setCarreraId] = useState(''); // Si está vacío "", es para TODOS

  // 1. Cargamos las carreras para el filtro
  const { data: dataCarreras, loading: loadingCarreras } = useQuery<CarrerasData>(GET_CARRERAS);

  // 2. Preparamos la mutación de envío
  // Agregamos <EnviarMasivoData> para que TypeScript sepa qué hay dentro de 'data'
  const [enviarMasivo, { loading: loadingEnvio }] = useMutation<EnviarMasivoData>(ENVIAR_MASIVO, {
    onCompleted: (data) => {
      // ¡Ahora TypeScript sabe que data.enviarAvisoMasivo existe y es un texto!
      toast.success(data.enviarAvisoMasivo);
      setMensaje(''); 
    },
    onError: (error) => {
      toast.error(`Error al enviar: ${error.message}`);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mensaje.trim()) {
      toast.warning('Escribe un mensaje primero');
      return;
    }

    // Confirmación visual para el usuario
    const destino = carreraId 
      ? `a la carrera seleccionada` 
      : 'a TODOS los estudiantes';
      
    if (!confirm(`¿Estás seguro de enviar este mensaje ${destino}?`)) {
      return;
    }

    enviarMasivo({
      variables: {
        mensaje,
        // Truco: Si carreraId es string vacío "", enviamos null para que GraphQL no se queje
        carreraId: carreraId || null 
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="border-b pb-2">
        <h2 className="text-xl font-bold text-gray-800">Enviar Comunicado Oficial</h2>
        <p className="text-sm text-gray-500">Los mensajes se enviarán vía WhatsApp</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* SELECCIÓN DE DESTINATARIO */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Destinatarios
          </label>
          <select 
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white font-medium text-gray-700"
            value={carreraId}
            onChange={(e) => setCarreraId(e.target.value)}
            disabled={loadingCarreras}
          >
            {/* Opción por defecto: TODOS */}
            <option value="" className="font-bold text-primary">
              ENVIAR A TODOS LOS ESTUDIANTES
            </option>
            
            <optgroup label="Segmentar por Carrera">
              {dataCarreras?.carreras.map((carrera) => (
                <option key={carrera.id} value={carrera.id}>
                  🎓 {carrera.nombre}
                </option>
              ))}
            </optgroup>
          </select>
          <p className="text-xs text-gray-400 mt-1">
            {carreraId ? 'Solo recibirán el mensaje los alumnos de esta carrera.' : 'Se enviará a toda la base de datos activa.'}
          </p>
        </div>

        {/* ÁREA DE TEXTO */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mensaje
          </label>
          <textarea 
            rows={4}
            placeholder="Escribe el comunicado aquí... (Ej: Se suspenden las clases por elecciones)"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            required
          />
        </div>

        {/* BOTÓN DE ENVÍO */}
        <button 
          type="submit" 
          disabled={loadingEnvio}
          className={`w-full py-3 px-4 rounded-lg text-white font-bold transition-all shadow-md flex justify-center items-center gap-2
            ${loadingEnvio ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 hover:shadow-lg'}
          `}
        >
          {loadingEnvio ? (
            <span>🚀 Enviando...</span>
          ) : (
            <span>Enviar Mensaje WhatsApp</span>
          )}
        </button>

      </form>
    </div>
  );
};