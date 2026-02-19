// src/modules/mensajeria/components/layout/Sidebar.tsx
import logoUagrm from '../../../../../public/logo-uagrm.png'; // Ajusta la ruta si es necesario

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: number;
  onChangeView: (view: number) => void;
}

// 1. Define la "forma" de los datos que recibe el botón
interface NavButtonProps {
  isActive: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode; // ReactNode permite pasar elementos JSX (como el <path>)
}

export const Sidebar = ({ isOpen, onClose, activeView, onChangeView }: SidebarProps) => {
  
  const handleNavClick = (viewIndex: number) => {
    onChangeView(viewIndex);
    onClose(); // Cierra el menú en móvil al hacer clic
  };

  return (
    <aside className={`
        fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 
        transform transition-transform duration-300 ease-in-out flex flex-col shadow-xl md:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 
    `}>
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
        <div className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
          <img src={logoUagrm} alt="Logo UAGRM" className="h-10 w-auto object-contain" />
          <span>UAGRM <span className="text-gray-400 font-light">Connect</span></span>
        </div>
        <button onClick={onClose} className="md:hidden text-gray-500 hover:text-red-500">
          X
        </button>
      </div>

      {/* Navegación */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Principal</p>
        
        <NavButton 
          isActive={activeView === 0} 
          onClick={() => handleNavClick(0)} 
          label="Dashboard" 
          icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />}
        />
        <NavButton 
          isActive={activeView === 1} 
          onClick={() => handleNavClick(1)} 
          label="Comunicados" 
          icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />}
        />
        <NavButton 
          isActive={activeView === 2} 
          onClick={() => handleNavClick(2)} 
          label="Estudiantes" 
          icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />}
        />
        {/* NUEVO: BOTÓN DE CHAT */}
        <NavButton 
          isActive={activeView === 3} 
          onClick={() => handleNavClick(3)} 
          label="Mensajes en Vivo" 
          icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />}
        />
      </nav>

      {/* User Footer */}
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
  );
};
// Pequeño componente interno para evitar repetir clases CSS
const NavButton = ({ isActive, onClick, label, icon }: NavButtonProps) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm
      ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-gray-600 hover:bg-gray-50 hover:text-primary'}`}
  >
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      {icon}
    </svg>
    {label}
  </button>
);