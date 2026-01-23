import { LogOut, Users, Mail, Info } from 'lucide-react';
import logoUrl from '../assets/AESicono.svg';
import React, { useEffect, useState } from 'react'; // <--- Asegúrate de que esto esté presente

const Layout = ({ children, usuario, onLogout, setVistaActual, PROYECTO_INFO }) => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      {/* HEADER FIJO */}
      <header className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setVistaActual('inicio')}>
          {/* ELIMINAMOS EL BG-BLUE-600 Y EL PADDING */}
          <div className="transition-transform duration-300 group-hover:scale-105">
            <img 
              src={logoUrl} 
              alt="AeroSamec Logo" 
              className="h-12 w-auto drop-shadow-sm" // Ajustamos la altura y quitamos el fondo azul
            />
          </div>
          
          <div>
          <h1 className="text-xl font-black text-blue-800 tracking-tighter uppercase leading-none">
            AeroSamec
          </h1>
          <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-1">
            Panel de Gestión
          </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-gray-800 leading-none">{usuario?.nombre}</p>
            <p className="text-[10px] text-blue-500 font-bold uppercase tracking-tighter mt-1">{usuario?.rol}</p>
          </div>
          <button onClick={onLogout} className="flex items-center gap-2 bg-red-50 text-red-500 px-4 py-2.5 rounded-2xl font-black text-xs hover:bg-red-500 hover:text-white transition-all group shadow-sm shadow-red-50">
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="hidden md:inline">SALIR</span>
          </button>
        </div>
      </header>

      {/* CONTENIDO DINÁMICO */}
      <main className="max-w-7xl mx-auto p-8 flex-1 w-full">
        {children}
      </main>

      {/* FOOTER FIJO */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 py-4 px-8 z-40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Info size={14} className="text-blue-500" />
              <span className="text-[10px] font-black uppercase tracking-widest">Versión {PROYECTO_INFO.version}</span>
            </div>
            <div className="hidden md:block h-4 w-px bg-gray-100"></div>
            <span className="text-[10px] font-bold tracking-tight">© {PROYECTO_INFO.anio} AeroSamec</span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Ref: <span className="text-gray-500">{PROYECTO_INFO.referente}</span></span>
            <a href={`mailto:${PROYECTO_INFO.email}`} className="flex items-center gap-2 bg-white border border-gray-100 px-4 py-1.5 rounded-xl text-[10px] font-black text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
              <Mail size={12} />
              {PROYECTO_INFO.email}
            </a>
          </div>
        </div>
      </footer>
      <div className="h-20"></div> {/* Espaciador para que el contenido no quede bajo el footer */}
    </div>
  );
};

export default Layout;