import { useState, useEffect } from 'react';
import UserCard from './UserCard';

const PUESTOS_VALIDOS = [
  "Gerente", 
  "Sub gerente", 
  "Coordinador", 
  "Jefe de sector", 
  "Secretaria/o contable", 
  "Secretario/a administrativa", 
  "Otro"
];

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [nombre, setNombre] = useState('');
  const [puesto, setPuesto] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  const API_URL = "http://localhost/api-equipo/index.php";

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setUsuarios(data))
      .catch(err => console.error("Error cargando datos:", err));
  }, []);

  const manejarEnvio = async (e) => {
    e.preventDefault();
    if (!nombre || !puesto) return;
    const datos = { nombre, puesto };

    try {
      if (editandoId) {
        await fetch(API_URL, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...datos, id: editandoId })
        });
        setUsuarios(usuarios.map(u => u.id === editandoId ? { ...u, ...datos } : u));
        setEditandoId(null);
      } else {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datos)
        });
        const resData = await res.json();
        if (resData.id) {
          setUsuarios([{ ...datos, id: resData.id }, ...usuarios]);
        }
      }
      setNombre('');
      setPuesto('');
    } catch (err) {
      console.error("Error en la operación:", err);
    }
  };

  const eliminarUsuario = async (id) => {
    try {
      await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
      setUsuarios(usuarios.filter(u => u.id !== id));
    } catch (err) {
      console.error("Error al borrar:", err);
    }
  };

  const prepararEdicion = (usuario) => {
    setEditandoId(usuario.id);
    setNombre(usuario.nombre);
    setPuesto(usuario.puesto);
  };

  // --- Lógica de filtrado (Debe estar AQUÍ, antes del return) ---
  
  const usuariosFiltrados = usuarios.filter((u) => {
    const termino = busqueda.toLowerCase();
    return (
      u.nombre.toLowerCase().includes(termino) || 
      u.puesto.toLowerCase().includes(termino)
    );
  });
  
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto"> 
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Gestor de Equipo Profesional
        </h1>
        
        <form onSubmit={manejarEnvio} className="bg-white p-6 rounded-2xl shadow-md mb-8 flex flex-col md:flex-row gap-4 items-end border border-gray-200">
          <div className="flex-1 w-full">
            <label className="text-xs text-gray-400 uppercase font-bold ml-1">Nombre</label>
            <input 
              className="border-2 border-gray-100 p-2.5 rounded-xl w-full focus:border-blue-500 outline-none transition-all"
              type="text" placeholder="Ej: Juan Pérez" value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div className="flex-1 w-full">
            <label className="text-xs text-gray-400 uppercase font-bold ml-1">Puesto</label>
            <input 
              className="border-2 border-gray-100 p-2.5 rounded-xl w-full focus:border-blue-500 outline-none transition-all"
              type="text" placeholder="Ej: Desarrollador" value={puesto}
              onChange={(e) => setPuesto(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            className={`px-8 py-3 rounded-xl font-bold text-white transition-all shadow-lg w-full md:w-auto ${
              editandoId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {editandoId ? 'Actualizar' : 'Añadir'}
          </button>
        </form>

        <div className="relative mb-8">
          <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Buscar por nombre o puesto..."
            className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-100 rounded-2xl shadow-sm focus:border-blue-500 outline-none transition-all"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="mt-10">
          <div className="sticky top-0 z-10 bg-gray-100 pb-2 hidden md:block">
            <div className="bg-white border-b-2 border-gray-200 px-8 py-3 rounded-t-xl flex items-center text-xs font-extrabold text-gray-400 uppercase tracking-wider">
              <div className="w-10 mr-4"></div>
              <div className="min-w-[200px] flex-1">Nombre</div>
              <div className="flex-1">Puesto</div>
              <div className="w-40 text-right">Acciones</div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {usuariosFiltrados.map(u => (
              <UserCard 
                key={u.id} 
                nombre={u.nombre} 
                puesto={u.puesto} 
                alBorrar={() => eliminarUsuario(u.id)}
                alEditar={() => prepararEdicion(u)}
              />
            ))}
          </div>
        </div>

        {usuarios.length > 0 && usuariosFiltrados.length === 0 && (
          <p className="text-center text-gray-400 mt-10 italic">No se encontraron empleados.</p>
        )}
      </div>
    </div>
  );
}

export default App;