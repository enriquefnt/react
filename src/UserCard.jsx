// UserCard.jsx
function UserCard({ dni, nombre, puesto, alBorrar, alEditar }) {
  return (
    <div className="bg-white border border-gray-200 px-8 py-4 flex items-center gap-4">
      <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">{nombre[0]}</div>
      <div className="w-32 font-mono text-gray-600">{dni}</div>
      <div className="flex-1 font-semibold">{nombre}</div>
      <div className="flex-1 text-gray-500">{puesto}</div>
      <div className="w-40 text-right">
        <button onClick={alEditar} className="text-blue-600 mr-4">Editar</button>
        <button onClick={alBorrar} className="text-red-600">Borrar</button>
      </div>
    </div>
  );
}

export default UserCard;