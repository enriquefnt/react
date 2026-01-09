import { useState, useEffect } from 'react';
import Login from './components/Login';
import DashboardAdmin from './components/DashboardAdmin';
import FormularioInforme from './components/FormularioInforme';

function App() {
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const API_URL = "http://localhost/api-equipo/index.php";

  // Al iniciar, cargar sesión y datos si es admin
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
    } catch (err) { console.error("Error cargando usuarios:", err); }
  };

  const loginExitoso = (user) => {
    setUsuarioLogueado(user);
    localStorage.setItem('usuario', JSON.stringify(user));
    if (user.rol === 'Administrador') cargarUsuarios();
  };

  const cerrarSesion = () => {
    setUsuarioLogueado(null);
    localStorage.removeItem('usuario');
  };

  if (!usuarioLogueado) {
    return <Login onLogin={loginExitoso} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* BARRA SUPERIOR DE SESIÓN */}
        <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {usuarioLogueado.nombre[0]}
            </div>
            <p className="text-sm text-gray-600">
              Conectado como: <span className="font-bold text-gray-800">{usuarioLogueado.nombre}</span> 
              <span className="ml-2 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[10px] uppercase font-black">{usuarioLogueado.rol}</span>
            </p>
          </div>
          <button onClick={cerrarSesion} className="text-red-500 hover:text-red-700 text-sm font-bold transition-colors">
            Cerrar Sesión
          </button>
        </div>

        {/* CONTENIDO SEGÚN ROL */}
        {/* SI ES ADMIN, puede ver el Gestor O el Formulario. 
      SI ES USUARIO/SUPERVISOR, solo ve el Formulario */}
      
  {usuarioLogueado.rol === 'Administrador' ? (
    <div className="space-y-12">
       <FormularioInforme usuario={usuarioLogueado} />
       <hr className="border-gray-200" />
       <DashboardAdmin usuarios={usuarios} setUsuarios={setUsuarios} API_URL={API_URL} />
    </div>
  ) : (
    <FormularioInforme usuario={usuarioLogueado} />
  )}
      </div>
    </div>
  );
}

export default App;



