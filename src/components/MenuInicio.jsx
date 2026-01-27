import { FileText, Users, Plane, ClipboardCheck } from 'lucide-react'; // Cambiamos BarChart3 por Plane

const MenuInicio = ({ usuario, setVistaActual }) => {
  return (
    <div className="animate-in fade-in zoom-in duration-300">
      <h2 className="text-3xl font-black text-gray-800 mb-10 tracking-tight">¿Qué deseas hacer hoy?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* BOTÓN ESTÁNDAR PARA TODOS */}
        <button onClick={() => setVistaActual('informe')} className="bg-white p-10 rounded-[35px] shadow-sm border border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all text-left group">
          <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
            <FileText size={32} />
          </div>
          <h3 className="text-xl font-black text-gray-800">Cargar Actividad</h3>
          <p className="text-gray-400 font-medium mt-2">Registra tus tareas y novedades del día.</p>
        </button>

        {/* BOTÓN SOLO ADMIN */}
        {usuario.rol === 'Administrador' && (
          <button onClick={() => setVistaActual('usuarios')} className="bg-white p-10 rounded-[35px] shadow-sm border border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all text-left group">
            <div className="bg-purple-50 w-16 h-16 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:bg-purple-600 group-hover:text-white transition-all">
              <Users size={32} />
            </div>
            <h3 className="text-xl font-black text-gray-800">Manejo de Equipo</h3>
            <p className="text-gray-400 font-medium mt-2">Gestionar altas, bajas y permisos.</p>
          </button>
        )}

        {/* BOTÓN COORDINADOR Y ADMIN - GESTIÓN DE VUELOS */}
        {(usuario.rol === 'Coordinador' || usuario.rol === 'Administrador') && (
          <button onClick={() => setVistaActual('supervision')} className="bg-white p-10 rounded-[35px] shadow-sm border border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all text-left group">
            <div className="bg-green-50 w-16 h-16 rounded-2xl flex items-center justify-center text-green-600 mb-6 group-hover:bg-green-600 group-hover:text-white transition-all">
              <Plane size={32} />
            </div>
            <h3 className="text-xl font-black text-gray-800">Gestión de Traslados</h3>
            <p className="text-gray-400 font-medium mt-2">Cargar nuevas solicitudes y planes de vuelo.</p>
          </button>
        )}
      </div>
    </div>
  );
};

export default MenuInicio;