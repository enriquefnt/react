import { LogOut, Users, LayoutDashboard, Settings } from 'lucide-react';

const Navbar = ({ usuario, onLogout }) => {
  return (
    <header className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
      {/* LADO IZQUIERDO: LOGO */}
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-100">
          <Users size={24} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-xl font-black text-gray-800 tracking-tighter uppercase leading-none">AeroSamec</h1>
          <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mt-1">Sistema de Gestión</p>
        </div>
      </div>

      {/* LADO DERECHO: INFO Y SALIDA */}
      <div className="flex items-center gap-6">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-black text-gray-800 leading-none">{usuario?.nombre || 'Admin'}</p>
          <p className="text-[10px] text-blue-500 font-bold uppercase tracking-tighter mt-1">{usuario?.rol || 'Administrador'}</p>
        </div>

        <button 
          onClick={onLogout}
          className="flex items-center gap-2 bg-red-50 text-red-500 px-4 py-2.5 rounded-2xl font-black text-xs hover:bg-red-500 hover:text-white transition-all group"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="hidden md:inline">CERRAR SESIÓN</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;