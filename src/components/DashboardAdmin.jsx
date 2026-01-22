import { useState } from 'react';
import UserCard from './UserCard';
import { LogOut, UserPlus, Users, Search, X } from 'lucide-react';
import CONFIG from '../config'; 

const PUESTOS_VALIDOS = ["Gerente", "Sub gerente", "Coordinador", "Jefe de sector", "Secretaria/o contable", "Secretario/a administrativa"];
const ROLES = ["Usuario", "Supervisor", "Administrador"];

const capitalizarTexto = (texto) => {
    if (!texto) return "";
    return texto.toLowerCase().split(' ').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
};

const DashboardAdmin = ({ usuarios, setUsuarios, API_URL, usuarioLogueado, onLogout }) => {
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
                await fetch(API_URL, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...datos, id: editandoId })
                });
                setUsuarios(usuarios.map(u => u.id === editandoId ? { ...u, ...datos } : u));
                cerrarModal();
            } else {
                    const res = await fetch(`${CONFIG.API_URL}/crear_usuario.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datos)
                });

                const resData = await res.json();

                if (resData.status === "success") {
                    const nuevoUsuarioLista = {
                        ...datos,
                        id: resData.id,
                        cambio_password: 1
                    };
                    setUsuarios([nuevoUsuarioLista, ...usuarios]);
                    alert(`¡Éxito!\nUsuario creado y mail enviado.`);
                    cerrarModal();
                } else {
                    alert("Error: " + (resData.message || "No se pudo crear"));
                }
            }
        } catch (err) {
            alert("Error de conexión");
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
        <div className="min-h-screen bg-gray-50 font-sans">
            

            {/* --- CONTENIDO --- */}
            <main className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h2 className="text-3xl font-black text-gray-800 tracking-tight">Gestor de Equipo</h2>
                    <button 
                        onClick={() => setMostrarModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-blue-100 transition-all flex items-center gap-2 transform hover:scale-105 active:scale-95"
                    >
                        <UserPlus size={20} />
                        <span>NUEVO EMPLEADO</span>
                    </button>
                </div>

                {/* Buscador Profesional */}
                <div className="relative mb-8 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={22} />
                    <input
                        type="text" placeholder="Buscar por nombre, DNI, email o rol..."
                        className="w-full pl-14 pr-6 py-5 bg-white border-2 border-transparent rounded-[22px] shadow-sm focus:border-blue-500 focus:bg-white outline-none text-lg transition-all"
                        value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>

                {/* Tabla de Usuarios */}
                <div className="bg-white rounded-[35px] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="hidden md:flex bg-gray-50/50 border-b border-gray-100 px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                        <div className="w-12 mr-4 text-center">Perfil</div>
                        <div className="w-32">DNI / Estado</div>
                        <div className="flex-1">Nombre y Email</div>
                        <div className="flex-1">Puesto / Rol</div>
                        <div className="w-32 text-right">Acciones</div>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {usuariosFiltrados.map(u => (
                            <UserCard 
                                key={u.id} 
                                {...u}
                                alBorrar={() => eliminarUsuario(u.id)} 
                                alEditar={() => prepararEdicion(u)} 
                            />
                        ))}
                    </div>
                </div>
            </main>

           {/* MODAL DE REGISTRO / EDICIÓN */}
{mostrarModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop (Fondo oscuro) */}
        <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={cerrarModal} />
        
        {/* Contenedor del Modal */}
        <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl z-10 overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[85vh]">
            
            {/* Header del Modal - Fijo arriba */}
            <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-xl font-black text-gray-800 tracking-tighter">
                    {editandoId ? 'Editar Perfil' : 'Crear Nuevo Acceso'}
                </h3>
                <button onClick={cerrarModal} className="p-2 hover:bg-white rounded-xl transition-colors text-gray-400 hover:text-red-500">
                    <X size={24} />
                </button>
            </div>

            {/* Cuerpo del Formulario - Con Scroll interno si es necesario */}
            <div className="overflow-y-auto p-8 custom-scrollbar">
                <form onSubmit={manejarEnvio} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">DNI (Usuario)</label>
                        <input className="w-full bg-gray-50 border-2 border-gray-100 p-3.5 rounded-2xl focus:border-blue-500 focus:bg-white outline-none font-bold transition-all text-sm" 
                            type="text" value={dni} onChange={(e) => setDni(e.target.value.replace(/\D/g,'').slice(0,8))} required />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">Email Personal</label>
                        <input className="w-full bg-gray-50 border-2 border-gray-100 p-3.5 rounded-2xl focus:border-blue-500 focus:bg-white outline-none font-bold transition-all text-sm" 
                            type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="md:col-span-2 space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">Nombre Completo</label>
                        <input className="w-full bg-gray-50 border-2 border-gray-100 p-3.5 rounded-2xl focus:border-blue-500 focus:bg-white outline-none font-bold transition-all text-sm" 
                            type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">Puesto en Empresa</label>
                        <select className="w-full bg-gray-50 border-2 border-gray-100 p-3.5 rounded-2xl focus:border-blue-500 focus:bg-white outline-none font-bold transition-all appearance-none text-sm"
                            value={PUESTOS_VALIDOS.includes(puesto) ? puesto : (puesto === '' ? '' : 'Otro')}
                            onChange={(e) => e.target.value === 'Otro' ? setPuesto('') : setPuesto(e.target.value)}>
                            <option value="" disabled>Seleccionar...</option>
                            {PUESTOS_VALIDOS.map(p => <option key={p} value={p}>{p}</option>)}
                            <option value="Otro">Otro...</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">Rol de Sistema</label>
                        <select className="w-full bg-gray-50 border-2 border-gray-100 p-3.5 rounded-2xl focus:border-blue-500 focus:bg-white outline-none font-bold transition-all appearance-none text-sm"
                            value={rol} onChange={(e) => setRol(e.target.value)}>
                            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                    
                    {/* Input extra si elige "Otro" */}
                    {!PUESTOS_VALIDOS.includes(puesto) && (
                        <div className="md:col-span-2 animate-in slide-in-from-top-2 duration-300">
                            <input className="w-full border-2 border-blue-100 p-3.5 rounded-2xl bg-blue-50 focus:border-blue-500 outline-none font-bold text-sm" 
                                placeholder="Especifique el puesto..." type="text" value={puesto} onChange={(e) => setPuesto(e.target.value)} autoFocus />
                        </div>
                    )}

                    {/* Botones de acción - Dentro del scroll para asegurar visibilidad */}
                    <div className="md:col-span-2 flex gap-4 mt-4">
                        <button type="button" onClick={cerrarModal} className="flex-1 py-3.5 text-gray-400 font-black uppercase text-[10px] tracking-widest hover:bg-gray-50 rounded-2xl transition-all">Cancelar</button>
                        <button type="submit" className="flex-[2] py-3.5 bg-blue-600 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">
                            {editandoId ? 'Actualizar' : 'Registrar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
)}
        </div>
    );
};

export default DashboardAdmin;