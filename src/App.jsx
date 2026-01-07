import { useState, useEffect } from 'react';
import UserCard from './UserCard';

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

  // --- FUNCIÓN UNIFICADA (Esta es la que manda ahora) ---
  const manejarEnvio = async (e) => {
    e.preventDefault();
    if (!nombre || !puesto) return;

    const datos = { nombre, puesto };

    try {
      if (editandoId) {
        // MODO EDICIÓN (PUT)
        await fetch(API_URL, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...datos, id: editandoId })
        });
        
        setUsuarios(usuarios.map(u => u.id === editandoId ? { ...u, ...datos } : u));
        setEditandoId(null);
      } else {
        // MODO CREACIÓN (POST)
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
      // Limpiar el formulario
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

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Gestor de Empleados (Full Stack)</h1>
        
        {/* IMPORTANTE: Aquí cambiamos agregarUsuario por manejarEnvio */}
        <form onSubmit={manejarEnvio} className="bg-white p-6 rounded-xl shadow-md mb-8 flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="text-xs text-gray-400 uppercase font-bold">Nombre</label>
            <input 
              className="border p-2 rounded w-full"
              type="text" placeholder="Ej: Juan Pérez" value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div className="flex-1 w-full">
            <label className="text-xs text-gray-400 uppercase font-bold">Puesto</label>
            <input 
              className="border p-2 rounded w-full"
              type="text" placeholder="Ej: Desarrollador" value={puesto}
              onChange={(e) => setPuesto(e.target.value)}
            />
          </div>
          
          <button 
            type="submit" 
            className={`px-6 py-2.5 rounded-xl font-bold text-white transition-all shadow-lg ${
              editandoId 
              ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-200' 
              : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
            }`}
          >
            {editandoId ? 'Actualizar' : 'Añadir'}
          </button>
        </form>

        {/* Grid de Tarjetas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {usuarios.map(u => (
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
      </div>
    
  );
}

export default App;