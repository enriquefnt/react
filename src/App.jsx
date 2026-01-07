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

const capitalizarTexto = (texto) => {
  return texto
    .toLowerCase()
    .split(' ')
    .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(' ');
};
function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [nombre, setNombre] = useState('');
  const [DNI, setDNI] = useState('');
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
  
    // 1. Limpieza, Formato y Validaciones
    // Trim quita espacios, y luego capitalizamos (Pedro Torres)
    const nombreFormateado = capitalizarTexto(nombre.trim());
    const puestoLimpio = puesto.trim();
  
    if (nombreFormateado.length < 3) {
      alert("El nombre es demasiado corto");
      return;
    }
  
    if (!puestoLimpio) {
      alert("Por favor, seleccione un puesto");
      return;
    }
  
    // Usamos el nombre ya formateado para enviar a la DB
    const datos = { nombre: nombreFormateado, puesto: puestoLimpio };
  
    try {
      if (editandoId) {
        // MODO EDICIÓN
        await fetch(API_URL, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...datos, id: editandoId })
        });
        setUsuarios(usuarios.map(u => u.id === editandoId ? { ...u, ...datos } : u));
        setEditandoId(null);
      } else {
        // MODO CREACIÓN
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
      // Limpiar campos
      setNombre('');
      setPuesto('');
    } catch (err) {
      console.error("Error:", err);
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
{/* Campo Puesto (Select) */}
<div className="flex-1 w-full">
  <label className="text-xs text-gray-400 uppercase font-bold ml-1">Puesto</label>
  <select 
    className="border-2 border-gray-100 p-2.5 rounded-xl w-full focus:border-blue-500 outline-none bg-white transition-all"
    // Si el puesto actual no está en la lista de "fijos", mostramos "Otro" en el select
    value={PUESTOS_VALIDOS.includes(puesto) ? puesto : (puesto === '' ? '' : 'Otro')}
    onChange={(e) => {
      if (e.target.value === 'Otro') {
        setPuesto(''); // Limpiamos para que escriba en el nuevo input
      } else {
        setPuesto(e.target.value);
      }
    }}
  >
    <option value="" disabled>Seleccionar puesto...</option>
    {PUESTOS_VALIDOS.map(p => (
      p !== "Otro" && <option key={p} value={p}>{p}</option>
    ))}
    <option value="Otro">Otro (especificar...)</option>
  </select>
</div>

{/* Campo Extra (Solo aparece si el puesto no está en la lista fija y no está vacío) */}
{!PUESTOS_VALIDOS.includes(puesto) && (
  <div className="flex-1 w-full animate-in fade-in slide-in-from-left-2 duration-300">
    <label className="text-xs text-blue-600 uppercase font-bold ml-1">Especificar puesto</label>
    <input 
      className="border-2 border-blue-200 p-2.5 rounded-xl w-full focus:border-blue-500 outline-none bg-blue-50"
      type="text" 
      placeholder="¿Qué puesto ocupa?"
      value={puesto}
      onChange={(e) => setPuesto(e.target.value)}
      autoFocus 
    />
  </div>
)}
          <button 
  disabled={nombre.length < 3 || !puesto}
  className={`px-8 py-3 rounded-xl font-bold text-white transition-all shadow-lg w-full md:w-auto ${
    (nombre.length < 3 || !puesto) 
    ? 'bg-gray-300 cursor-not-allowed' 
    : (editandoId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700')
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