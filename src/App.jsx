import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

// Componentes
import Login from './components/Login';
import DashboardAdmin from './components/DashboardAdmin';
import FormularioInforme from './components/FormularioInforme';
import VistaSupervisor from './components/VistaSupervisor';
import CambiarPassword from './components/CambiarPassword';
import Layout from './components/Layout';
import MenuInicio from './components/MenuInicio';
import CONFIG from './config';

const PROYECTO_INFO = {
  version: "1.0.0",
  anio: new Date().getFullYear(),
  referente: "Tu Nombre",
  email: "soporte@aerosamec.com"
};

function App() {
  const [usuarioLogueado, setUsuarioLogueado] = useState(() => {
    const sesionGuardada = localStorage.getItem('usuario');
    try { return sesionGuardada ? JSON.parse(sesionGuardada) : null; } catch { return null; }
  });

  const [usuarios, setUsuarios] = useState([]);
  const [vistaActual, setVistaActual] = useState('inicio');
  const API_URL = `${CONFIG.API_URL}/index.php`;

  // --- EFECTOS ---
  useEffect(() => {
    if (usuarioLogueado?.rol === 'Administrador') cargarUsuarios();
  }, [usuarioLogueado]);

  const cargarUsuarios = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setUsuarios(data);
    } catch (err) { console.error(err); }
  };

  const loginExitoso = (user) => {
    setUsuarioLogueado(user);
    localStorage.setItem('usuario', JSON.stringify(user));
    localStorage.setItem('loginTimestamp', new Date().getTime().toString());
  };

  const cerrarSesion = () => {
    setUsuarioLogueado(null);
    localStorage.clear();
    setVistaActual('inicio');
  };

  return (
    <Router>
      <Routes>
        <Route path="/cambiar-password" element={<CambiarPassword />} />
        <Route path="/" element={
          !usuarioLogueado ? (
            <Login onLogin={loginExitoso} />
          ) : (
            <Layout 
              usuario={usuarioLogueado} 
              onLogout={cerrarSesion} 
              setVistaActual={setVistaActual}
              PROYECTO_INFO={PROYECTO_INFO}
            >
              {vistaActual === 'inicio' ? (
                <MenuInicio usuario={usuarioLogueado} setVistaActual={setVistaActual} />
              ) : (
                <div className="animate-in slide-in-from-bottom-4 duration-500">
                  <button onClick={() => setVistaActual('inicio')} className="flex items-center gap-2 text-gray-400 hover:text-blue-600 font-black text-xs uppercase tracking-widest mb-8 transition-colors group">
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Volver al Menú
                  </button>
                  {vistaActual === 'informe' && <FormularioInforme usuario={usuarioLogueado} />}
                  {vistaActual === 'usuarios' && <DashboardAdmin usuarios={usuarios} setUsuarios={setUsuarios} API_URL={API_URL} usuarioLogueado={usuarioLogueado} />}
                  {vistaActual === 'supervision' && <VistaSupervisor />}
                </div>
              )}
            </Layout>
          )
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;