// src/UserCard.jsx
function UserCard({ nombre, puesto, alBorrar, alEditar }) {
  return (
    <div className="bg-white border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md transition-all px-8 py-4 flex flex-col md:flex-row items-center gap-4">
      
      {/* Avatar */}
      <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shrink-0 shadow-sm">
        {nombre.charAt(0).toUpperCase()}
      </div>

      {/* Nombre */}
      <div className="min-w-[200px] flex-1 w-full">
        <p className="text-xs text-gray-400 font-bold md:hidden uppercase">Nombre</p>
        <h3 className="text-gray-800 font-medium text-base">{nombre}</h3>
      </div>

      {/* Puesto */}
      <div className="flex-1 w-full">
        <p className="text-xs text-gray-400 font-bold md:hidden uppercase">Puesto</p>
        <p className="text-gray-600 italic md:not-italic">{puesto}</p>
      </div>

      {/* Acciones */}
      <div className="w-full md:w-40 flex justify-end gap-2 shrink-0">
        <button 
          onClick={alEditar}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="Editar"
        >
          <span className="text-xl">✎</span>
        </button>
        <button 
          onClick={alBorrar}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Borrar"
        >
          <span className="text-xl">🗑</span>
        </button>
      </div>
    </div>
  );
}

export default UserCard;