import { useState } from 'react';
import { useMutation } from '@apollo/client/react'; // Nota: Lo estándar es importar desde @apollo/client
import { ENVIAR_AVISO_MASIVO } from '../../../../graphql/mutations/mensaje.mutations';
import { toast } from 'sonner';


export const MensajeForm = () => {
  const [mensaje, setMensaje] = useState('');
  const [enviarMasivo, { loading }] = useMutation(ENVIAR_AVISO_MASIVO);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mensaje) {
        toast.warning("El mensaje no puede estar vacío");
        return;
    }

    try {
      await enviarMasivo({ variables: { mensaje } });
      setMensaje('');
      // MENSAJE DE ÉXITO ÉPICO
      toast.success("¡Campaña iniciada! Los mensajes se están enviando.");
    } catch (error) {
      console.error(error);
      toast.error("Hubo un problema al iniciar el envío.");
    }
  };

  return (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

      <h3 style={{ marginBottom: '15px', color: 'var(--primary)', textAlign: 'center' }}>
        Enviar Comunicado
      </h3>
      
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <textarea
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Escribe tu mensaje aquí (Ej: Hola alumnos, mañana no hay clases...)"
          style={{ 
            width: '100%', 
            padding: '12px', 
            borderRadius: '8px', 
            border: '1px solid #ddd',
            marginBottom: '15px',
            fontFamily: 'inherit', // Para que use la fuente Poppins
            resize: 'none', // Para que no deformen el diseño
            flex: 1 // Ocupa todo el espacio disponible
          }}
        />
        
        <button 
          type="submit" 
          disabled={loading || !mensaje}
          className="btn btn-primary"
          style={{ width: '100%', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? '🚀 Enviando...' : 'Enviar Masivo'}
        </button>
      
      </form>
    </div>
  );
};