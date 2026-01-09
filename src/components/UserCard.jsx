function UserCard({ dni, nombre, email, puesto, rol, alBorrar, alEditar }) {
  return (
    <div className="bg-white px-8 py-4 flex flex-col md:flex-row items-center gap-4 hover:bg-gray-50 transition-all">
      {/* Avatar circular con inicial */}
      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-full flex items-center justify-center font-bold shadow-sm">
        {nombre[0]}
      </div>

      {/* DNI */}
      <div className="w-32 shrink-0 font-mono text-sm text-gray-500">
        {dni}
      </div>

      {/* Nombre y Email */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-800 truncate">{nombre}</p>
        <p className="text-xs text-gray-400 truncate">{email}</p>
      </div>

      {/* Puesto y Rol */}
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-700">{puesto}</p>
        <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-bold ${
          rol === 'Administrador' ? 'bg-purple-100 text-purple-600' : 
          rol === 'Supervisor' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'
        }`}>
          {rol}
        </span>
      </div>

      {/* Botones de acción */}
      <div className="w-32 flex justify-end gap-2">
        <button onClick={alEditar} className="p-2 hover:bg-blue-50 rounded-xl text-blue-600 transition-colors">✏️</button>
        <button onClick={alBorrar} className="p-2 hover:bg-red-50 rounded-xl text-red-600 transition-colors">🗑️</button>
      </div>
    </div>
  );
}

export default UserCard;