import { useState } from 'react';

// Componentes de Vistas
import { Dashboard } from '../components/Dashboard/Dashboard';
import { MensajeForm } from '../components/MensajeForm/MensajeForm';
import { EstudianteForm } from '../components/EstudianteForm/EstudianteForm';
import { EstudianteList } from '../components/EstudianteList/EstudianteList';
import { MobileOverlay } from '../components/layout/MobileOverlay';
import { ChatView } from '../components/Chat/ChatView';

// Componentes de Layout (Nuevos)
import { Sidebar } from '../components/layout/Sidebar';
import { MobileHeader } from '../components/layout/MobileHeader';

export const MensajeriaPage = () => {
  const [vistaActiva, setVistaActiva] = useState(0);
  const [menuAbierto, setMenuAbierto] = useState(false);

return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans relative">
      
      {/* 1. USAMOS EL COMPONENTE OVERLAY */}
      {menuAbierto && (
        <MobileOverlay onClose={() => setMenuAbierto(false)} />
      )}

      {/* 2. SIDEBAR */}
      <Sidebar 
        isOpen={menuAbierto} 
        onClose={() => setMenuAbierto(false)} 
        activeView={vistaActiva}
        onChangeView={setVistaActiva}
      />

      {/* 3. CONTENIDO PRINCIPAL */}
      <main className="flex-1 overflow-y-auto h-full p-4 md:p-8 w-full">
        <MobileHeader onOpenMenu={() => setMenuAbierto(true)} />

        {/* --- RENDERIZADO DE VISTAS --- */}
        
        {/* VISTA 0: DASHBOARD */}
        {vistaActiva === 0 && (
          <div className="max-w-6xl mx-auto animate-fadeIn mt-4">
            <header className="mb-8 hidden md:block">
              <h2 className="text-2xl font-bold text-gray-800">Resumen General</h2>
              <p className="text-gray-500">Métricas clave del sistema de mensajería.</p>
            </header>
            <Dashboard />
          </div>
        )}

        {/* VISTA 1: COMUNICADOS */}
        {vistaActiva === 1 && (
          <div className="max-w-3xl mx-auto animate-fadeIn">
            <header className="mb-6 hidden md:block">
              <h2 className="text-2xl font-bold text-gray-800">Centro de Mensajería</h2>
              <p className="text-gray-500">Envía notificaciones masivas vía WhatsApp.</p>
            </header>
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <MensajeForm />
            </div>
          </div>
        )}

        {/* VISTA 2: ESTUDIANTES */}
        {vistaActiva === 2 && (
          <div className="max-w-7xl mx-auto animate-fadeIn">
            <header className="mb-6 hidden md:block">
              <h2 className="text-2xl font-bold text-gray-800">Gestión Académica</h2>
              <p className="text-gray-500">Administra el directorio de estudiantes por carrera.</p>
            </header>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4 order-2 lg:order-1">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:sticky lg:top-4">
                  <EstudianteForm />
                </div>
              </div>
              <div className="lg:col-span-8 order-1 lg:order-2">
                <EstudianteList />
              </div>
            </div>
          </div>
        )}
        {/* VISTA 3: CHAT EN VIVO */}
        {vistaActiva === 3 && (
          <div className="max-w-7xl mx-auto animate-fadeIn h-full"> {/* h-full es importante */}
            <header className="mb-4 hidden md:block">
              <h2 className="text-2xl font-bold text-gray-800">Mensajes en Vivo</h2>
              <p className="text-gray-500">Atención personalizada en tiempo real.</p>
            </header>
            
            {/* Aquí renderizamos el Chat */}
            <ChatView />
          </div>
        )}

      </main>
    </div>
  );
};