// AGREGA 'cambio_password' a la lista de props aquí:
function UserCard({ dni, nombre, email, puesto, rol, cambio_password, alBorrar, alEditar }) {
  return (
    <div className="bg-white px-8 py-4 flex flex-col md:flex-row items-center gap-4 hover:bg-gray-50 transition-all">
      
      {/* Indicador de Estado (Puntito) */}
      <div className="flex items-center" title={cambio_password == 0 ? "Cuenta Activada" : "Pendiente de Activación"}>
        <div className={`w-3 h-3 rounded-full ${cambio_password == 0 ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-amber-500 animate-pulse'}`}></div>
      </div>

      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-full flex items-center justify-center font-bold shadow-sm">
        {nombre ? nombre[0] : '?'}
      </div>

      <div className="w-32 shrink-0 font-mono text-sm text-gray-500">
        {dni}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-800 truncate">{nombre}</p>
        <p className="text-xs text-gray-400 truncate">{email}</p>
      </div>

      <div className="flex-1">
        <p className="text-sm font-medium text-gray-700">{puesto}</p>
        <div className="flex items-center gap-2">
            <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-bold ${
            rol === 'Administrador' ? 'bg-purple-100 text-purple-600' : 
            rol === 'Supervisor' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'
            }`}>
            {rol}
            </span>
            {/* Texto de estado opcional */}
            <span className="text-[9px] font-black uppercase text-gray-300">
                {cambio_password == 0 ? '✓ Activo' : '⌛ Pendiente'}
            </span>
        </div>
      </div>

      <div className="w-32 flex justify-end gap-2">
        <button onClick={alEditar} className="p-2 text-blue-400 hover:bg-blue-50 rounded-lg transition-colors">✏️</button>
        <button onClick={alBorrar} className="p-2 text-red-300 hover:bg-red-50 rounded-lg transition-colors">🗑️</button>
      </div>
    </div>
  );
}

export default UserCard;