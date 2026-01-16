import { Pencil, Trash2, ShieldCheck, User, UserCog } from 'lucide-react';

function UserCard({ dni, nombre, email, puesto, rol, cambio_password, alBorrar, alEditar }) {
  
  // Función interna para elegir el icono del avatar según el rol
  const IconoRol = () => {
    if (rol === 'Administrador') return <ShieldCheck size={18} />;
    if (rol === 'Supervisor') return <UserCog size={18} />;
    return <User size={18} />;
  };

  return (
    <div className="bg-white px-8 py-5 flex flex-col md:flex-row items-center gap-6 hover:bg-gray-50/80 transition-all border-b border-gray-50 last:border-none group">
      
      {/* Indicador de Estado (Puntito con sombra dinámica) */}
      <div className="flex items-center shrink-0" title={cambio_password == 0 ? "Cuenta Activada" : "Pendiente de Activación"}>
        <div className={`w-2.5 h-2.5 rounded-full ${
          cambio_password == 0 
            ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' 
            : 'bg-amber-500 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.4)]'
        }`}></div>
      </div>

      {/* Avatar con Icono de Rol */}
      <div className="relative shrink-0">
        <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-900 text-white rounded-2xl flex items-center justify-center font-black shadow-md transform group-hover:rotate-3 transition-transform">
          {nombre ? nombre[0].toUpperCase() : '?'}
        </div>
        <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-lg shadow-sm border border-gray-100 text-blue-600">
           <IconoRol />
        </div>
      </div>

      {/* DNI - Con fuente mono para alineación perfecta */}
      <div className="w-24 shrink-0 font-mono text-xs font-black text-gray-400 tracking-tighter">
        {dni}
      </div>

      {/* Info Principal */}
      <div className="flex-1 min-w-0">
        <p className="font-black text-gray-800 truncate text-sm uppercase tracking-tight">{nombre}</p>
        <p className="text-xs text-gray-400 truncate font-medium">{email}</p>
      </div>

      {/* Puesto y Rol */}
      <div className="flex-1 hidden lg:block">
        <p className="text-xs font-black text-gray-700 uppercase tracking-tighter">{puesto}</p>
        <div className="flex items-center gap-2 mt-1">
            <span className={`text-[9px] uppercase px-2 py-0.5 rounded-lg font-black tracking-widest ${
            rol === 'Administrador' ? 'bg-purple-100 text-purple-600' : 
            rol === 'Supervisor' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
            }`}>
            {rol}
            </span>
            <span className={`text-[9px] font-black uppercase ${cambio_password == 0 ? 'text-green-500' : 'text-amber-500'}`}>
                {cambio_password == 0 ? '● Activo' : '● Pendiente'}
            </span>
        </div>
      </div>

      {/* Botones de Acción (aparecen más claros al hacer hover en la fila) */}
      <div className="flex justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={alEditar}
          className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
          title="Editar Perfil"
        >
          <Pencil size={18} strokeWidth={2.5} />
        </button>
        <button 
          onClick={alBorrar}
          className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
          title="Eliminar de la Empresa"
        >
          <Trash2 size={18} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

export default UserCard;