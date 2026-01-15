import { useState } from 'react';
import UserCard from './UserCard';

const PUESTOS_VALIDOS = ["Gerente", "Sub gerente", "Coordinador", "Jefe de sector", "Secretaria/o contable", "Secretario/a administrativa"];
const ROLES = ["Usuario", "Supervisor", "Administrador"];

const capitalizarTexto = (texto) => {
  if (!texto) return "";
  return texto.toLowerCase().split(' ').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
};

const DashboardAdmin = ({ usuarios, setUsuarios, API_URL }) => {
  const [nombre, setNombre] = useState('');
  const [dni, setDni] = useState('');
  const [email, setEmail] = useState('');
  const [puesto, setPuesto] = useState('');
  const [rol, setRol] = useState('Usuario');
  const [editandoId, setEditandoId] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);

  const manejarEnvio = async (e) => {
    e.preventDefault();
    const datos = { 
      nombre: capitalizarTexto(nombre.trim()), 
      dni: dni.trim(), 
      email: email.trim(), 
      puesto: puesto.trim(), 
      rol 
    };

    try {
      if (editandoId) {
        // --- EDITAR USUARIO ---
        const res = await fetch(API_URL, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...datos, id: editandoId })
        });
        
        if (res.ok) {
          setUsuarios(usuarios.map(u => u.id === editandoId ? { ...u, ...datos } : u));
          cerrarModal();
        }
      } else {
        // --- CREAR USUARIO NUEVO ---
        const res = await fetch("http://localhost/api-equipo/crear_usuario.php", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datos)
        });
        
        const resData = await res.json();
        
        // Verificamos el status "success" que envía tu PHP
        if (resData.status === "success") {
          // Agregamos a la lista con id y el flag de cambio_password en 1 (naranja/pendiente)
          const nuevoUsuarioLista = { 
            ...datos, 
            id: resData.id, 
            cambio_password: 1 
          };
          
          setUsuarios([nuevoUsuarioLista, ...usuarios]);
          
          alert(`¡Éxito!\nUsuario: ${datos.dni}\nEmail enviado a: ${datos.email}\nClave Temporal: ${resData.temp_password}`);
          cerrarModal();
        } else {
          alert("Error: " + (resData.message || "No se pudo crear el usuario"));
        }
      }
    } catch (err) { 
      console.error(err); 
      alert("Error de conexión con el servidor");
    }
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setEditandoId(null);
    setNombre(''); setDni(''); setEmail(''); setPuesto(''); setRol('Usuario');
  };

  const prepararEdicion = (u) => {
    setEditandoId(u.id);
    setNombre(u.nombre); setDni(u.dni); setEmail(u.email || ''); setPuesto(u.puesto); setRol(u.rol || 'Usuario');
    setMostrarModal(true);
  };

  const eliminarUsuario = async (id) => {
    if (!confirm("¿Eliminar empleado?")) return;
    try {
      await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
      setUsuarios(usuarios.filter(u => u.id !== id));
    } catch (err) { console.error(err); }
  };

  const usuariosFiltrados = usuarios.filter(u => {
    const t = busqueda.toLowerCase();
    return `${u.nombre} ${u.dni} ${u.email} ${u.puesto} ${u.rol}`.toLowerCase().includes(t);
  });

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Gestor de Equipo</h1>
        <button 
          onClick={() => setMostrarModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold shadow-lg transition-all transform hover:scale-105"
        >
          + Nuevo Empleado
        </button>
      </div>

      <div className="relative mb-8">
        <span className="absolute inset-y-0 left-4 flex items-center text-gray-400 text-xl">🔍</span>
        <input
          type="text" placeholder="Buscar por nombre, DNI, email o rol..."
          className="w-full pl-14 pr-6 py-4 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none text-lg transition-all"
          value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="hidden md:flex bg-gray-50 border-b border-gray-100 px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">
          <div className="w-12 mr-4"></div>
          <div className="w-32">DNI / Estado</div>
          <div className="flex-1">Nombre y Email</div>
          <div className="flex-1">Puesto / Rol</div>
          <div className="w-32 text-right">Acciones</div>
        </div>
        <div className="divide-y divide-gray-100">
          {usuariosFiltrados.map(u => (
            <UserCard 
              key={u.id} 
              dni={u.dni} 
              nombre={u.nombre} 
              email={u.email} 
              rol={u.rol} 
              puesto={u.puesto} 
              cambio_password={u.cambio_password} // Pasamos el estado de la clave
              alBorrar={() => eliminarUsuario(u.id)} 
              alEditar={() => prepararEdicion(u)} 
            />
          ))}
        </div>
      </div>

      {/* MODAL (Sin cambios en estructura, solo en la lógica de envío arriba) */}
      {mostrarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={cerrarModal} />
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl z-10 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">{editandoId ? 'Editar Perfil' : 'Nuevo Acceso'}</h3>
              <button onClick={cerrarModal} className="text-3xl text-gray-300 hover:text-gray-500">&times;</button>
            </div>
            <form onSubmit={manejarEnvio} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">DNI (Usuario)</label>
                <input className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-blue-500 outline-none" 
                  type="text" value={dni} onChange={(e) => setDni(e.target.value.replace(/\D/g,'').slice(0,8))} required />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Email Personal</label>
                <input className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-blue-500 outline-none" 
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Nombre Completo</label>
                <input className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-blue-500 outline-none" 
                  type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Puesto</label>
                <select className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-blue-500 outline-none bg-white"
                  value={PUESTOS_VALIDOS.includes(puesto) ? puesto : (puesto === '' ? '' : 'Otro')}
                  onChange={(e) => e.target.value === 'Otro' ? setPuesto('') : setPuesto(e.target.value)}>
                  <option value="" disabled>Seleccionar...</option>
                  {PUESTOS_VALIDOS.map(p => <option key={p} value={p}>{p}</option>)}
                  <option value="Otro">Otro...</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Rol de Acceso</label>
                <select className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-blue-500 outline-none bg-white"
                  value={rol} onChange={(e) => setRol(e.target.value)}>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              {!PUESTOS_VALIDOS.includes(puesto) && (
                <div className="md:col-span-2">
                  <input className="w-full border-2 border-blue-100 p-3 rounded-xl bg-blue-50 focus:border-blue-500 outline-none" 
                    placeholder="Especifique el puesto..." type="text" value={puesto} onChange={(e) => setPuesto(e.target.value)} autoFocus />
                </div>
              )}
              <div className="md:col-span-2 flex gap-3 mt-4">
                <button type="button" onClick={cerrarModal} className="flex-1 py-4 text-gray-400 font-bold hover:bg-gray-50 rounded-2xl transition-all">Cancelar</button>
                <button type="submit" className="flex-[2] py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg hover:bg-blue-700 transition-all">
                  {editandoId ? 'Guardar Cambios' : 'Generar Acceso'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardAdmin;