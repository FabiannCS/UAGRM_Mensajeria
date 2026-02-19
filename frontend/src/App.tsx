import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

// Importamos las páginas
import { LoginPage } from '././modules/mensajeria/pages/LoginPage'; // Asegúrate de que esta ruta sea correcta
import { MensajeriaPage } from './modules/mensajeria/pages/MensajeriaPage';
import { ProtectedRoute } from './modules/mensajeria/components/ProtectedRoute/ProtectedRoute';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      {/* El Toaster debe estar dentro del Router pero fuera de Routes para funcionar siempre */}
      <Toaster position="top-right" richColors />

      <Routes>
        {/* === RUTA PÚBLICA === */}
        <Route path="/login" element={<LoginPage />} />

        {/* === ZONA PRIVADA (Protegida por el Guardia) === */}
        <Route element={<ProtectedRoute />}>
            {/* Si entran a la raíz "/", los mandamos al dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Aquí cargamos tu módulo de Mensajería como el Dashboard principal */}
            <Route path="/dashboard" element={<MensajeriaPage />} />
        </Route>

        {/* === RUTA POR DEFECTO === */}
        {/* Si escriben cualquier locura en la URL, los mandamos al inicio */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;