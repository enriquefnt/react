import { useState, useEffect } from 'react';

const CambiarPassword = () => {
    const params = new URLSearchParams(window.location.search);
    const [nombreUsuario, setNombreUsuario] = useState(params.get('nombre') || 'Usuario');
    
    const [datos, setDatos] = useState({
        dni: params.get('dni') || '',
        passActual: '',
        passNueva: '',
        passConfirmar: '' // Nuevo campo
    });

    const manejarCambio = async (e) => {
        e.preventDefault();
        
        if (datos.passNueva !== datos.passConfirmar) {
            alert("Las contraseñas nuevas no coinciden");
            return;
        }

        const res = await fetch("http://localhost/api-equipo/actualizar_password.php", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                dni: datos.dni,
                passActual: datos.passActual,
                passNueva: datos.passNueva
            })
        });
        
        const r = await res.json();
        if(r.status === 'success') {
            alert("¡Éxito! Tu cuenta ha sido activada.");
            window.location.href = "/";
        } else {
            alert(r.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <form onSubmit={manejarCambio} className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">¡Hola, {nombreUsuario}!</h2>
                    <p className="text-gray-500 text-sm">Configura tu contraseña definitiva</p>
                </div>

                <div className="space-y-4">
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <p className="text-[10px] uppercase font-bold text-gray-400">DNI Identificador</p>
                        <p className="font-mono font-bold text-gray-700">{datos.dni}</p>
                    </div>

                    <input type="password" placeholder="Clave temporal del correo" required
                           className="w-full p-4 border-2 rounded-2xl outline-none focus:border-blue-500"
                           onChange={e => setDatos({...datos, passActual: e.target.value})} />
                    
                    <input type="password" placeholder="Nueva contraseña" required
                           className="w-full p-4 border-2 rounded-2xl outline-none focus:border-blue-500"
                           onChange={e => setDatos({...datos, passNueva: e.target.value})} />

                    <input type="password" placeholder="Confirmar nueva contraseña" required
                           className="w-full p-4 border-2 rounded-2xl outline-none focus:border-blue-500"
                           onChange={e => setDatos({...datos, passConfirmar: e.target.value})} />

                    <button className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg hover:bg-blue-700">
                        Confirmar y Activar Cuenta
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CambiarPassword;