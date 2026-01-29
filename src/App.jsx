import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// Componentes
import Login from './components/Login';
import DashboardAdmin from './components/DashboardAdmin';
import FormularioInforme from './components/FormularioInforme';
import VistaCoordinador from './components/VistaCoordinador';
import CambiarPassword from './components/CambiarPassword';
import Layout from './components/Layout';
import MenuInicio from './components/MenuInicio';
import CONFIG from './config';
import GestorTraslados from './components/GestorTraslados'; // Ajusta la ruta si es necesario

const PROYECTO_INFO = {
  version: "1.0.1",
  anio: new Date().getFullYear(),
  referente: "Tu Nombre",
  email: "soporte@aerosamec.com"
};

function App() {
  const [usuarioLogueado, setUsuarioLogueado] = useState(() => {
    const sesionGuardada = localStorage.getItem('usuario');
    try { 
      return sesionGuardada ? JSON.parse(sesionGuardada) : null; 
    } catch { 
      return null; 
    }
  });

  const [usuarios, setUsuarios] = useState([]);
  const [vistaActual, setVistaActual] = useState('inicio');
  const API_BASE = CONFIG.API_URL; 

  // Manejo de conexión a Internet
  useEffect(() => {
    const manejarOnline = () => toast.success("Conexión restablecida", { icon: '✈️' });
    const manejarOffline = () => toast.error("Se ha perdido la conexión a internet", { duration: Infinity });

    const buscarEnServidor = async () => {
  setCargando(true);
  try {
    const url = filtros.busqueda.length > 0 
      ? `${API_URL}/traslados.php?buscar=${encodeURIComponent(filtros.busqueda)}`
      : `${API_URL}/traslados.php`; // Sin el ?limit=5 para probar si trae todo

    console.log("Pidiendo a:", url); // <--- MIRA ESTO EN CONSOLA
    
    const res = await fetch(url);
    const data = await res.json();
    
    console.log("Respuesta PHP:", data); // <--- MIRA ESTO EN CONSOLA

    // Forzamos que siempre sea un array para que el .map no falle
    if (Array.isArray(data)) {
      setTraslados(data);
    } else {
      console.error("El PHP no devolvió un array:", data);
      setTraslados([]);
    }
  } catch (error) {
    console.error("Error fatal en el fetch:", error);
    toast.error("Error de conexión con el servidor");
  } finally {
    setCargando(false);
  }
};

    window.addEventListener('online', manejarOnline);
    window.addEventListener('offline', manejarOffline);

    return () => {
      window.removeEventListener('online', manejarOnline);
      window.removeEventListener('offline', manejarOffline);
    };
  }, []);

  // Carga de usuarios (Solo para Administradores)
  useEffect(() => {
    if (usuarioLogueado?.rol === 'Administrador') {
      cargarUsuarios();
    }
  }, [usuarioLogueado]);

  const cargarUsuarios = async () => {
    try {
      const res = await fetch(`${API_BASE}/index.php`);
      if (res.status === 401) return;
      const data = await res.json();
      setUsuarios(data);
    } catch (err) { 
      console.error("Error cargando usuarios:", err); 
    }
  };

  const loginExitoso = (user) => {
    setUsuarioLogueado(user);
    console.log("Sesión iniciada con éxito:", user);
    localStorage.setItem('usuario', JSON.stringify(user));
    localStorage.setItem('loginTimestamp', new Date().getTime().toString());
  };

  const cerrarSesion = () => {
    setUsuarioLogueado(null);
    localStorage.clear();
    setVistaActual('inicio');
  };

  // Objeto de usuario normalizado para evitar errores de ROL vacío
  const usuarioProcesado = usuarioLogueado ? {
    ...usuarioLogueado,
    rol: (usuarioLogueado.rol === "" && usuarioLogueado.puesto?.includes('Coord')) 
         ? "Coordinador" 
         : usuarioLogueado.rol
  } : null;

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Router>
        <Routes>
          <Route path="/cambiar-password" element={<CambiarPassword />} />
          <Route path="/" element={
            !usuarioProcesado ? (
              <Login onLogin={loginExitoso} />
            ) : (
              <Layout 
                usuario={usuarioProcesado} 
                onLogout={cerrarSesion} 
                setVistaActual={setVistaActual}
                PROYECTO_INFO={PROYECTO_INFO}
              >
                {/* LÓGICA DE NAVEGACIÓN INTERNA */}
                {vistaActual === 'inicio' ? (
                  <MenuInicio usuario={usuarioProcesado} setVistaActual={setVistaActual} />
                ) : (
                  <div className="animate-in slide-in-from-bottom-4 duration-500">
                    <button 
                      onClick={() => setVistaActual('inicio')} 
                      className="flex items-center gap-2 text-gray-400 hover:text-blue-600 font-black text-xs uppercase tracking-widest mb-8 transition-colors group"
                    >
                      <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                      Volver al Menú
                    </button>
                    
                    {/* Renderizado Condicional de Componentes */}
                    {console.log("Cargando vista:", vistaActual)}

                    {vistaActual === 'informe' && (
                      <FormularioInforme usuario={usuarioProcesado} />
                    )}
                    
                    {vistaActual === 'usuarios' && (
                      <DashboardAdmin 
                        usuarios={usuarios} 
                        setUsuarios={setUsuarios} 
                        API_URL={`${API_BASE}/index.php`} 
                        usuarioLogueado={usuarioProcesado} 
                      />
                    )}

                    {(vistaActual === 'supervision' || vistaActual === 'Coordinador') && (
                      <GestorTraslados 
                        usuarioLogueado={usuarioProcesado} 
                        API_URL={API_BASE} 
                      />
                    )}
                  </div>
                )}
              </Layout>
            )
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;