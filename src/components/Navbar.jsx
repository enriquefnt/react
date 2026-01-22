import { LogOut } from 'lucide-react';
import logoUrl from '../assets/AESicono.svg'; // Asegúrate que el archivo se llame así en assets

const Navbar = ({ usuario, onLogout }) => {
  return (
    <header className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
      
      {/* LADO IZQUIERDO: LOGO Y NOMBRE */}
      <div className="flex items-center gap-4">
        <img src={logoUrl} alt="Logo" className="h-10 w-10 shadow-sm rounded-lg" />
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tighter uppercase leading-none">
            AeroSamec
          </h1>
          <p className="text-[9px] text-slate-400 font-bold tracking-[0.2em] uppercase mt-1">
            Transporte Aéreo Crítico
          </p>
        </div>
      </div>

      {/* LADO DERECHO: PERFIL Y LOGOUT */}
      <div className="flex items-center gap-6">
        <div className="text-right hidden sm:block border-r pr-6 border-slate-100">
          <p className="text-sm font-black text-slate-800 leading-none">
            {usuario?.nombre || 'Operador'}
          </p>
          <p className="text-[10px] text-blue-600 font-bold uppercase mt-1">
            {usuario?.rol || 'Personal'}
          </p>
        </div>

        <button 
          onClick={onLogout}
          className="flex items-center gap-2 bg-red-50 text-red-500 px-4 py-2.5 rounded-xl font-black text-xs hover:bg-red-500 hover:text-white transition-all duration-300 group"
        >
          <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="hidden md:inline">CERRAR SESIÓN</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;