interface MobileOverlayProps {
  onClose: () => void;
}

export const MobileOverlay = ({ onClose }: MobileOverlayProps) => {
  return (
    <div 
      className="fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity cursor-pointer animate-fadeIn"
      onClick={onClose} // Al hacer clic en lo oscuro, se ejecuta la función de cerrar
      aria-hidden="true"
    />
  );
};