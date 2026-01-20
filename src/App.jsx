import { useState, useEffect } from 'react';
import Login from './components/Login';
import DashboardAdmin from './components/DashboardAdmin';
import FormularioInforme from './components/FormularioInforme';
import VistaSupervisor from './components/VistaSupervisor';
import CambiarPassword from './components/CambiarPassword';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LogOut, Users, FileText, BarChart3, ChevronLeft, Mail, Info } from 'lucide-react';

function App() {
  // --- BLINDAJE 1: PERSISTENCIA DE ESTADO ---
  // Inicializamos el estado leyendo directamente de localStorage
  const [usuarioLogueado, setUsuarioLogueado] = useState(() => {
    const sesionGuardada = localStorage.getItem('usuario');
    if (sesionGuardada) {
      try {
        return JSON.parse(sesionGuardada);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [usuarios, setUsuarios] = useState([]);
  const [vistaActual, setVistaActual] = useState('inicio'); 
  const TIEMPO_EXPIRACION = 30 * 60 * 1000;
  
  const API_URL = "http://localhost/api-equipo/index.php";

  // --- BLINDAJE 2: BASE DE RUTA AUTOMÁTICA ---
  const baseVirtual = import.meta.env.DEV ? "/" : "/aerosamec-app";

  const PROYECTO_INFO = {
    version: "1.0.6", // Actualizamos versión
    anio: new Date().getFullYear(),
    referente: "Tu Nombre o Referente",
    email: "soporte@aerosamec.com"
  };

  useEffect(() => {
    const verificarSesion = () => {
      const sesion = localStorage.getItem('usuario');
      const loginTime = localStorage.getItem('loginTimestamp');
  
      if (sesion && loginTime) {
        const ahora = new Date().getTime();
        const transcurrido = ahora - parseInt(loginTime);
  
        if (transcurrido > TIEMPO_EXPIRACION) {
          alert("Su sesión ha expirado por seguridad (30 min). Por favor, ingrese nuevamente.");
          cerrarSesion();
        }
      }
    };
    const intervalo = setInterval(verificarSesion, 60000);
    return () => clearInterval(intervalo);
  }, [usuarioLogueado]);

  // Cargar usuarios automáticamente si el admin refresca la página
  useEffect(() => {
    if (usuarioLogueado?.rol === 'Administrador') {
      cargarUsuarios();
    }
  }, []);

  const cargarUsuarios = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setUsuarios(data);
    } catch (err) { console.error(err); }
  };

  const loginExitoso = (user) => {
    const ahora = new Date().getTime();
    setUsuarioLogueado(user);
    localStorage.setItem('usuario', JSON.stringify(user));
    localStorage.setItem('loginTimestamp', ahora.toString());
    if (user.rol === 'Administrador') cargarUsuarios();
    setVistaActual('inicio');
  };
  
  const cerrarSesion = () => {
    setUsuarioLogueado(null);
    localStorage.removeItem('usuario');
    localStorage.removeItem('loginTimestamp');
    setVistaActual('inicio');
  };

  const LayoutPrincipal = () => {
    if (!usuarioLogueado) return <Navigate to="/" replace />;

    return (
      <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
        {/* Tu Header y Main se mantienen igual... */}
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setVistaActual('inicio')}>
            <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform">
              <Users size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-800 tracking-tighter uppercase leading-none">AeroSamec</h1>
              <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mt-1">Panel de Gestión</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-gray-800 leading-none">{usuarioLogueado.nombre}</p>
              <p className="text-[10px] text-blue-500 font-bold uppercase tracking-tighter mt-1">{usuarioLogueado.rol}</p>
            </div>
            <button onClick={cerrarSesion} className="flex items-center gap-2 bg-red-50 text-red-500 px-4 py-2.5 rounded-2xl font-black text-xs hover:bg-red-500 hover:text-white transition-all group shadow-sm shadow-red-50">
              <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="hidden md:inline">SALIR</span>
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto p-8 flex-1 w-full">
          {vistaActual === 'inicio' && (
            <div className="animate-in fade-in zoom-in duration-300">
              <h2 className="text-3xl font-black text-gray-800 mb-10 tracking-tight">¿Qué deseas hacer hoy?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <button onClick={() => setVistaActual('informe')} className="bg-white p-10 rounded-[35px] shadow-sm border border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all text-left group">
                  <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <FileText size={32} />
                  </div>
                  <h3 className="text-xl font-black text-gray-800">Cargar Actividad</h3>
                  <p className="text-gray-400 font-medium mt-2">Registra tus tareas y novedades del día.</p>
                </button>

                {usuarioLogueado.rol === 'Administrador' && (
                  <button onClick={() => setVistaActual('usuarios')} className="bg-white p-10 rounded-[35px] shadow-sm border border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all text-left group">
                    <div className="bg-purple-50 w-16 h-16 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:bg-purple-600 group-hover:text-white transition-all">
                      <Users size={32} />
                    </div>
                    <h3 className="text-xl font-black text-gray-800">Manejo de Equipo</h3>
                    <p className="text-gray-400 font-medium mt-2">Gestionar altas, bajas y permisos.</p>
                  </button>
                )}

                {(usuarioLogueado.rol === 'Supervisor' || usuarioLogueado.rol === 'Administrador') && (
                  <button onClick={() => setVistaActual('supervision')} className="bg-white p-10 rounded-[35px] shadow-sm border border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all text-left group">
                    <div className="bg-green-50 w-16 h-16 rounded-2xl flex items-center justify-center text-green-600 mb-6 group-hover:bg-green-600 group-hover:text-white transition-all">
                      <BarChart3 size={32} />
                    </div>
                    <h3 className="text-xl font-black text-gray-800">Extracto de Actividad</h3>
                    <p className="text-gray-400 font-medium mt-2">Revisar informes de todo el equipo.</p>
                  </button>
                )}
              </div>
            </div>
          )}

          {vistaActual !== 'inicio' && (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <button onClick={() => setVistaActual('inicio')} className="flex items-center gap-2 text-gray-400 hover:text-blue-600 font-black text-xs uppercase tracking-widest mb-8 transition-colors group">
                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                Volver al Menú
              </button>
              {vistaActual === 'informe' && <FormularioInforme usuario={usuarioLogueado} />}
              {vistaActual === 'usuarios' && usuarioLogueado.rol === 'Administrador' && (
                <DashboardAdmin usuarios={usuarios} setUsuarios={setUsuarios} API_URL={API_URL} usuarioLogueado={usuarioLogueado} />
              )}
              {vistaActual === 'supervision' && <VistaSupervisor />}
            </div>
          )}
        </main>
        
        {/* Tu Footer se mantiene igual... */}
        <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 py-4 px-8 z-40">
           {/* ... contenido del footer ... */}
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
        <div className="h-20"></div>
      </div>
    );
  };

  return (
    <Router basename={baseVirtual}>
      <Routes>
        <Route path="/cambiar-password" element={<CambiarPassword />} />
        {/* BLINDAJE 3: REDIRECCIÓN INTELIGENTE */}
        <Route 
            path="/" 
            element={usuarioLogueado ? <LayoutPrincipal /> : <Login onLogin={loginExitoso} />} 
        />
        {/* Cualquier ruta que no exista, vuelve al inicio de la carpeta */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;