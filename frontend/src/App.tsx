import { EstudianteForm } from './modules/mensajeria/components/EstudianteForm/EstudianteForm';
import { MensajeForm } from './modules/mensajeria/components/MensajeForm/MensajeForm';
import { EstudianteList } from './modules/mensajeria/components/EstudianteList/EstudianteList';
import './App.css';
import { Toaster } from 'sonner';

function App() {
  return (
    <div className="app-container">
      
      {/* 2. AGREGAR EL COMPONENTE */}
      <Toaster position="top-right" richColors />

      {/* HEADER */}
      <header className="app-header">
        <h1 className="app-title">Sistema de Mensajería UAGRM</h1>
        <p className="app-subtitle">Gestión de estudiantes y envío de notificaciones WhatsApp</p>
      </header>

      {/* GRID SUPERIOR (Formularios) */}
      <div className="app-grid">
        {/* Columna Izquierda: Registrar */}
        <div className="card">
          <EstudianteForm />
        </div>

        {/* Columna Derecha: Enviar Mensaje */}
        <div className="card">
          <MensajeForm />
        </div>
      </div>

      {/* SECCIÓN INFERIOR (Lista) */}
      <div className="app-list-section card">
        <EstudianteList />
      </div>

    </div>
  )
}

export default App;