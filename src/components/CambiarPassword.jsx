import { useState } from 'react';
import { Eye, EyeOff, ShieldCheck, KeyRound } from 'lucide-react'; // Importamos los iconos profesionales

const CambiarPassword = () => {
    // Capturamos el DNI y Nombre de la URL
    const params = new URLSearchParams(window.location.search);
    const [datos, setDatos] = useState({
        dni: params.get('dni') || '',
        passActual: '',
        passNueva: ''
    });

    const nombreUsuario = params.get('nombre') || 'Usuario';

    // Estados para visibilidad de contraseñas
    const [verActual, setVerActual] = useState(false);
    const [verNueva, setVerNueva] = useState(false);
    const [cargando, setCargando] = useState(false);

    const manejarCambio = async (e) => {
        e.preventDefault();
        
        if (datos.passNueva.length < 6) {
            alert("La nueva clave debe tener al menos 6 caracteres.");
            return;
        }

        setCargando(true);
        try {
            const res = await fetch("http://localhost/api-equipo/actualizar_password.php", {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(datos)
            });
            const r = await res.json();
            if(r.status === 'success') {
                alert("¡Contraseña actualizada con éxito!");
                window.location.href = "/"; 
            } else {
                alert(r.message);
            }
        } catch (err) {
            alert("Error al conectar con el servidor.");
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
            <form onSubmit={manejarCambio} className="bg-white p-10 rounded-[35px] shadow-2xl w-full max-w-md border border-gray-100 animate-in fade-in zoom-in duration-500">
                
                <div className="text-center mb-8">
                    <div className="bg-green-600 w-16 h-16 rounded-2xl text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-100">
                        <ShieldCheck size={35} strokeWidth={2.5} />
                    </div>
                    <h2 className="text-3xl font-black text-gray-800 tracking-tighter">Hola, {nombreUsuario}</h2>
                    <p className="text-gray-400 font-medium mt-1">Actualiza tu contraseña de acceso</p>
                </div>

                <div className="space-y-5">
                    {/* DNI */}
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">Identificación</label>
                        <input 
                            type="text" 
                            value={datos.dni} 
                            disabled 
                            className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold text-gray-400 cursor-not-allowed" 
                        />
                    </div>

                    {/* Clave Temporal */}
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">Clave Temporal</label>
                        <div className="relative group">
                            <input 
                                type={verActual ? "text" : "password"} 
                                placeholder="Ingresa la clave recibida" 
                                required
                                className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-gray-700 pr-12"
                                onChange={e => setDatos({...datos, passActual: e.target.value})} 
                            />
                            <button 
                                type="button"
                                onClick={() => setVerActual(!verActual)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                            >
                                {verActual ? <EyeOff size={22} strokeWidth={2} /> : <Eye size={22} strokeWidth={2} />}
                            </button>
                        </div>
                    </div>

                    {/* Nueva Clave */}
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">Nueva Contraseña Definitiva</label>
                        <div className="relative group">
                            <input 
                                type={verNueva ? "text" : "password"} 
                                placeholder="Mínimo 6 caracteres" 
                                required
                                className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-gray-700 pr-12"
                                onChange={e => setDatos({...datos, passNueva: e.target.value})} 
                            />
                            <button 
                                type="button"
                                onClick={() => setVerNueva(!verNueva)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                            >
                                {verNueva ? <EyeOff size={22} strokeWidth={2} /> : <Eye size={22} strokeWidth={2} />}
                            </button>
                        </div>
                    </div>

                    <button 
                        disabled={cargando}
                        type="submit"
                        className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all mt-4 flex items-center justify-center gap-2"
                    >
                        <KeyRound size={20} />
                        {cargando ? 'ACTUALIZANDO...' : 'CONFIRMAR CAMBIO'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CambiarPassword;