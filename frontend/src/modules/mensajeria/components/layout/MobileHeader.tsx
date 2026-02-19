// src/modules/mensajeria/components/layout/MobileHeader.tsx
interface MobileHeaderProps {
  onOpenMenu: () => void;
}

export const MobileHeader = ({ onOpenMenu }: MobileHeaderProps) => {
  return (
    <div className="md:hidden flex items-center justify-between mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-2">
         <span className="font-bold text-gray-700">UAGRM Connect</span>
      </div>
      <button 
        onClick={onOpenMenu}
        className="p-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>
    </div>
  );
};