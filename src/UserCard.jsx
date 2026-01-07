// src/UserCard.jsx
function UserCard({ nombre, puesto, alBorrar, alEditar }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all p-6 flex flex-col h-full">
      {/* Avatar circular con la inicial */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl uppercase">
          {nombre.charAt(0)}
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800 leading-tight">{nombre}</h3>
          <p className="text-sm text-blue-600 font-medium">{puesto}</p>
        </div>
      </div>

      {/* Espaciador para empujar los botones al final si hay mucho texto */}
      <div className="flex-grow"></div>

      {/* Contenedor de Botones */}
      <div className="flex gap-3 mt-6">
        <button 
          onClick={alEditar}
          className="flex-1 px-4 py-2 bg-gray-50 text-gray-700 text-sm font-semibold rounded-lg border border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors flex items-center justify-center gap-2"
        >
          <span>✎</span> Editar
        </button>
        <button 
          onClick={alBorrar}
          className="flex-1 px-4 py-2 bg-gray-50 text-red-500 text-sm font-semibold rounded-lg border border-gray-200 hover:bg-red-50 hover:border-red-200 transition-colors flex items-center justify-center gap-2"
        >
          <span>🗑</span> Borrar
        </button>
      </div>
    </div>
  );
}

export default UserCard;