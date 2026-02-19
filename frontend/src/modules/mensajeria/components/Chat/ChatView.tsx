import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Search, Send, Loader2, User, MessageSquare } from 'lucide-react';

// Importamos tus queries y mutaciones
import { GET_ESTUDIANTES_CHAT, GET_DETALLE_CHAT } from '../../../../graphql/queries/mensajeria.queries';
import { ENVIAR_RESPUESTA_MANUAL } from '../../../../graphql/mutations/mensaje.mutations';

// --- INTERFACES ---
interface EstudianteResumen {
  id: string;
  nombre: string;
  celular: string;
  ultimoMensaje: string;
  ultimoMensajeTipo?: 'ENTRADA' | 'SALIDA';
  activo: boolean;
  
}

interface Mensaje {
  id: string;
  texto: string;
  tipo: 'ENTRADA' | 'SALIDA';
  timestamp: string;
  estado: string;
}

export const ChatView = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mensajeInput, setMensajeInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. QUERY: Lista de Estudiantes (Izquierda)
  const { data: dataLista, loading: loadingLista, error: errorLista } = useQuery(GET_ESTUDIANTES_CHAT, {
    pollInterval: 10000, // Refrescar lista cada 10s
  });

  // 2. QUERY: Detalle del Chat (Derecha) - Se ejecuta solo si hay selectedId
  const { data: dataChat, loading: loadingChat, refetch } = useQuery(GET_DETALLE_CHAT, {
    variables: { id: selectedId },
    skip: !selectedId,
    pollInterval: 3000, // Chat en tiempo real (polling simple)
  });

  // 3. MUTATION: Enviar Mensaje
  const [enviarMensaje, { loading: enviando }] = useMutation(ENVIAR_RESPUESTA_MANUAL, {
    onCompleted: () => {
      setMensajeInput(''); // Limpiar input
      refetch(); // Recargar mensajes
    }
  });

  // Auto-scroll al fondo cuando llegan mensajes nuevos
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [dataChat]);

  const handleEnviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mensajeInput.trim() || !selectedId) return;

    enviarMensaje({
      variables: {
        estudianteId: selectedId,
        texto: mensajeInput
      }
    });
  };

  // Filtrado de búsqueda local
  const [busqueda, setBusqueda] = useState('');
  const estudiantesFiltrados = dataLista?.listaEstudiantes.filter((est: EstudianteResumen) =>
    est.nombre.toLowerCase().includes(busqueda.toLowerCase())
  ) || [];

  if (errorLista) return <div className="p-8 text-red-500">Error al cargar el sistema de chat.</div>;

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      
      {/* --- COLUMNA IZQUIERDA: LISTA DE CONTACTOS --- */}
      <div className="w-80 border-r border-gray-100 flex flex-col bg-gray-50">
        {/* Buscador */}
        <div className="p-4 bg-white border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar estudiante..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        {/* Lista Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {loadingLista ? (
            <div className="flex justify-center p-4"><Loader2 className="animate-spin text-primary" /></div>
          ) : (
            estudiantesFiltrados.map((est: EstudianteResumen) => (
              <button
                key={est.id}
                onClick={() => setSelectedId(est.id)}
                className={`w-full p-4 flex items-center gap-3 hover:bg-white transition-colors border-b border-gray-100 text-left relative
                  ${selectedId === est.id ? 'bg-white border-l-4 border-l-primary shadow-sm' : ''}
                `}
              >
                {/* AVATAR CON INDICADOR */}
                <div className="relative shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                     ${selectedId === est.id ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}
                  `}>
                    {est.nombre.charAt(0)}
                  </div>
                  
                  {/* --- SEMÁFORO VISUAL --- */}
                  {est.ultimoMensajeTipo === 'ENTRADA' && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
                    </span>
                  )}
                  {est.ultimoMensajeTipo === 'SALIDA' && (
                     <span className="absolute -bottom-1 -right-1 bg-green-500 border-2 border-white rounded-full p-0.5">
                       <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                         <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                       </svg>
                     </span>
                  )}
                </div>

                {/* TEXTO */}
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between items-center">
                    <p className={`text-sm font-semibold truncate ${selectedId === est.id ? 'text-primary' : 'text-gray-700'}`}>
                      {est.nombre}
                    </p>
                    {/* Texto de "Pendiente" si corresponde */}
                    {est.ultimoMensajeTipo === 'ENTRADA' && (
                      <span className="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full">
                        Pendiente
                      </span>
                    )}
                  </div>
                  <p className={`text-xs truncate max-w-45 ${est.ultimoMensajeTipo === 'ENTRADA' ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
                    {est.ultimoMensaje}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* --- COLUMNA DERECHA: CONVERSACIÓN --- */}
      <div className="flex-1 flex flex-col bg-[#e5ddd5]/10 relative"> {/* Fondo estilo WhatsApp sutil */}
        
        {selectedId && dataChat?.estudiante ? (
          <>
            {/* Header del Chat */}
            <div className="p-4 bg-white border-b border-gray-100 flex items-center gap-3 shadow-sm z-10">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <User size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">{dataChat.estudiante.nombre}</h3>
                <p className="text-xs text-green-600 font-medium">
                  {dataChat.estudiante.carrera?.nombre || 'Sin Carrera'} • {dataChat.estudiante.celular}
                </p>
              </div>
            </div>

            {/* Area de Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat bg-opacity-5">
              {loadingChat ? (
                <div className="flex justify-center mt-10"><Loader2 className="animate-spin text-gray-400" /></div>
              ) : (
                dataChat.estudiante.historialChat.map((msg: Mensaje) => {
                  const esMio = msg.tipo === 'SALIDA';
                  return (
                    <div key={msg.id} className={`flex ${esMio ? 'justify-end' : 'justify-start'}`}>
                      <div className={`
                        max-w-[70%] px-4 py-2 rounded-xl shadow-sm text-sm relative
                        ${esMio ? 'bg-primary text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none'}
                      `}>
                        <p>{msg.texto}</p>
                        <span className={`text-[10px] block text-right mt-1 opacity-70 ${esMio ? 'text-blue-100' : 'text-gray-400'}`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          {esMio && <span className="ml-1">{msg.estado === 'LEIDO' ? '✓✓' : '✓'}</span>}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input de Envío */}
            <form onSubmit={handleEnviar} className="p-4 bg-white border-t border-gray-100 flex gap-2">
              <input
                type="text"
                placeholder="Escribe un mensaje..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                value={mensajeInput}
                onChange={(e) => setMensajeInput(e.target.value)}
                disabled={enviando}
              />
              <button 
                type="submit" 
                disabled={enviando || !mensajeInput.trim()}
                className="p-3 bg-primary text-white rounded-full hover:bg-primary-dark disabled:opacity-50 transition-colors"
              >
                {enviando ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
              </button>
            </form>
          </>
        ) : (
          /* ESTADO VACÍO (Cuando no has seleccionado a nadie) */
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <MessageSquare size={40} className="text-gray-300" />
            </div>
            <p className="font-medium text-lg">Selecciona un estudiante</p>
            <p className="text-sm">para ver su historial de chat</p>
          </div>
        )}
      </div>
    </div>
  );
};