import { useState } from 'react';
import { Dashboard } from '../components/Dashboard/Dashboard';
import { MensajeForm } from '../components/MensajeForm/MensajeForm';
import { EstudianteForm } from '../components/EstudianteForm/EstudianteForm';
import { EstudianteList } from '../components/EstudianteList/EstudianteList';

export const MensajeriaPage = () => {
  const [vistaActiva, setVistaActiva] = useState(0);
  
  // NUEVO: Estado para controlar el menú en celulares
  const [menuAbierto, setMenuAbierto] = useState(false);

  // Función auxiliar para cerrar el menú al hacer clic en una opción (solo en móvil)
  const cerrarMenu = () => setMenuAbierto(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans relative">
      
      {/* 1. OVERLAY (FONDO OSCURO) - Solo visible en móvil cuando el menú está abierto */}
      {menuAbierto && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity"
          onClick={cerrarMenu} // Al hacer clic en lo oscuro, se cierra
        />
      )}

      {/* 2. SIDEBAR (Menú Lateral) - Actualizado con lógica móvil */}
      <aside 
        className={`
          fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 
          transform transition-transform duration-300 ease-in-out flex flex-col shadow-xl md:shadow-none
          ${menuAbierto ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 
        `}
      >
        
        {/* Logo / Título */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
          <div className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
            <span className="bg-primary text-white p-1 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
            </span>
            <span>UAGRM <span className="text-gray-400 font-light">Connect</span></span>
          </div>

          {/* Botón X para cerrar (Solo visible en móvil dentro del sidebar) */}
          <button onClick={cerrarMenu} className="md:hidden text-gray-500 hover:text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Botones de Navegación */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Principal</p>
          
          <button onClick={() => { setVistaActiva(0); cerrarMenu(); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm
              ${vistaActiva === 0 ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-gray-600 hover:bg-gray-50 hover:text-primary'}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            Dashboard
          </button>

          <button onClick={() => { setVistaActiva(1); cerrarMenu(); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm
              ${vistaActiva === 1 ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-gray-600 hover:bg-gray-50 hover:text-primary'}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            Comunicados
          </button>

          <button onClick={() => { setVistaActiva(2); cerrarMenu(); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm
              ${vistaActiva === 2 ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-gray-600 hover:bg-gray-50 hover:text-primary'}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            Estudiantes
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-xs">AD</div>
            <div>
              <p className="text-sm font-bold text-gray-700">Admin</p>
              <p className="text-xs text-gray-400">En línea</p>
            </div>
          </div>
        </div>
      </aside>

      {/* --- ÁREA PRINCIPAL (Contenido) --- */}
      <main className="flex-1 overflow-y-auto h-full p-4 md:p-8 w-full">
        
        {/* 3. HEADER MÓVIL (Botón Hamburguesa) - Solo visible en celulares */}
        <div className="md:hidden flex items-center justify-between mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2">
               <span className="font-bold text-gray-700">UAGRM Connect</span>
            </div>
            <button 
              onClick={() => setMenuAbierto(true)}
              className="p-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {/* Ícono Hamburguesa */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
        </div>

        {/* VISTAS DINÁMICAS */}
        
        {/* VISTA 0: DASHBOARD */}
        {vistaActiva === 0 && (
          <div className="max-w-6xl mx-auto animate-fadeIn">
            <header className="mb-8 hidden md:block"> {/* Ocultamos header duplicado en movil */}
              <h2 className="text-2xl font-bold text-gray-800">Resumen General</h2>
              <p className="text-gray-500">Métricas clave del sistema de mensajería.</p>
            </header>
            <Dashboard />
          </div>
        )}

        {/* VISTA 1: COMUNICADOS */}
        {vistaActiva === 1 && (
          <div className="max-w-3xl mx-auto animate-fadeIn mt-4">
            <header className="mb-6 text-center hidden md:block">
              <h2 className="text-2xl font-bold text-gray-800">Centro de Mensajería</h2>
              <p className="text-gray-500">Envía notificaciones masivas vía WhatsApp.</p>
            </header>
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <MensajeForm />
            </div>
          </div>
        )}

        {/* VISTA 2: GESTIÓN DE ESTUDIANTES */}
        {vistaActiva === 2 && (
          <div className="max-w-7xl mx-auto animate-fadeIn">
            <header className="mb-6 hidden md:block">
              <h2 className="text-2xl font-bold text-gray-800">Gestión Académica</h2>
              <p className="text-gray-500">Administra el directorio de estudiantes por carrera.</p>
            </header>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Formulario */}
              <div className="lg:col-span-4 order-2 lg:order-1"> {/* En móvil se va abajo */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:sticky lg:top-4">
                  <EstudianteForm />
                </div>
              </div>
              
              {/* Lista */}
              <div className="lg:col-span-8 order-1 lg:order-2"> {/* En móvil aparece primero la lista */}
                <EstudianteList />
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};