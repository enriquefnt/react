import { useState, useEffect } from 'react';
import Login from './components/Login';
import DashboardAdmin from './components/DashboardAdmin';
import FormularioInforme from './components/FormularioInforme';
import VistaSupervisor from './components/VistaSupervisor';
import CambiarPassword from './components/CambiarPassword';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [vistaActual, setVistaActual] = useState('inicio'); 
  
  const API_URL = "http://localhost/api-equipo/index.php";

  useEffect(() => {
    const sesion = localStorage.getItem('usuario');
    if (sesion) {
      const user = JSON.parse(sesion);
      setUsuarioLogueado(user);
      if (user.rol === 'Administrador') cargarUsuarios();
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
    setUsuarioLogueado(user);
    localStorage.setItem('usuario', JSON.stringify(user));
    if (user.rol === 'Administrador') cargarUsuarios();
    setVistaActual('inicio');
  };

  const cerrarSesion = () => {
    setUsuarioLogueado(null);
    localStorage.removeItem('usuario');
    setVistaActual('inicio');
  };

  // --- COMPONENTE DE LA ESTRUCTURA PRINCIPAL ---
  const LayoutPrincipal = () => {
    if (!usuarioLogueado) return <Navigate to="/" />;

    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setVistaActual('inicio')}>
              <div className="bg-blue-600 p-2 rounded-lg text-white font-black">NE</div>
              <h1 className="text-xl font-black text-gray-800 tracking-tighter">AeroSamec</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-800 leading-none">{usuarioLogueado.nombre}</p>
                <span className="text-[10px] uppercase font-black text-blue-500 tracking-widest">{usuarioLogueado.rol}</span>
              </div>
              <button onClick={cerrarSesion} className="bg-red-50 text-red-500 p-2 rounded-xl hover:bg-red-100 transition-colors" title="Cerrar Sesión">
                🚪
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto p-6">
          {vistaActual === 'inicio' && (
            <div className="animate-in fade-in zoom-in duration-300">
              <h2 className="text-2xl font-bold text-gray-800 mb-8">¿Qué deseas hacer hoy?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <button onClick={() => setVistaActual('informe')} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all text-left group">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📝</div>
                  <h3 className="text-lg font-bold text-gray-800">Cargar Actividad Diaria</h3>
                  <p className="text-gray-400 text-sm mt-1">Registra tus tareas y novedades del día.</p>
                </button>

                {usuarioLogueado.rol === 'Administrador' && (
                  <button onClick={() => setVistaActual('usuarios')} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all text-left group">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">👥</div>
                    <h3 className="text-lg font-bold text-gray-800">Manejo de Usuarios</h3>
                    <p className="text-gray-400 text-sm mt-1">Crear, editar o dar de baja personal.</p>
                  </button>
                )}

                {(usuarioLogueado.rol === 'Supervisor' || usuarioLogueado.rol === 'Administrador') && (
                  <button onClick={() => setVistaActual('supervision')} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all text-left group">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📊</div>
                    <h3 className="text-lg font-bold text-gray-800">Extracto de Actividad</h3>
                    <p className="text-gray-400 text-sm mt-1">Revisar y comentar los informes del equipo.</p>
                  </button>
                )}
              </div>
            </div>
          )}

          {vistaActual !== 'inicio' && (
            <div>
              <button onClick={() => setVistaActual('inicio')} className="flex items-center gap-2 text-gray-400 hover:text-blue-600 font-bold mb-6 transition-colors">
                ← Volver al Menú
              </button>
              {vistaActual === 'informe' && <FormularioInforme usuario={usuarioLogueado} />}
              {vistaActual === 'usuarios' && usuarioLogueado.rol === 'Administrador' && (
                <DashboardAdmin usuarios={usuarios} setUsuarios={setUsuarios} API_URL={API_URL} />
              )}
              {vistaActual === 'supervision' && <VistaSupervisor />}
            </div>
          )}
        </main>
      </div>
    );
  };

  return (
    <Router>
      <Routes>
        {/* Ruta para cambiar password (Pública, se accede desde el mail) */}
        <Route path="/cambiar-password" element={<CambiarPassword />} />
        
        {/* Ruta raíz: Si no hay usuario va al Login, si hay va al Dashboard */}
        <Route path="/" element={
          !usuarioLogueado ? <Login onLogin={loginExitoso} /> : <LayoutPrincipal />
        } />

        {/* Redirigir cualquier otra ruta no existente a la raíz */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;