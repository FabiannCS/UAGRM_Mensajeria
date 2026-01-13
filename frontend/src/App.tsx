import { Toaster } from 'sonner';
import { MensajeriaPage } from './modules/mensajeria/pages/MensajeriaPage';
import './App.css';

function App() {
  return (
    <>
      {/* MensajeriaPage ya contiene el Sidebar, el Dashboard y los Formularios organizados */}
      <MensajeriaPage />
      
      {/* Las notificaciones deben estar aquí para verse encima de todo */}
      <Toaster position="top-right" richColors />
    </>
  )
}

export default App;