import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [datos, setDatos] = useState({ dni: '', password: '' });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState(''); 
  const [verPassword, setVerPassword] = useState(false);
  const [enviandoMail, setEnviandoMail] = useState(false); // Estado específico para el correo

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (datos.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setError('');
    setMensajeExito('');
    setCargando(true);

    try {
      const res = await fetch("http://localhost/api-equipo/login.php", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        onLogin(data.user);
      } else {
        setError(data.message || "Credenciales incorrectas");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
    } finally {
      setCargando(false);
    }
  };

  const recuperarPassword = async () => {
    if (!datos.dni) {
      setError("Por favor, ingresa tu DNI para recuperar la cuenta");
      return;
    }
    
    setError('');
    setMensajeExito('');
    setEnviandoMail(true); // Bloqueamos la interfaz para el envío

    try {
      const res = await fetch("http://localhost/api-equipo/recuperar_password.php", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ dni: datos.dni })
      });
      const r = await res.json();
      
      if (r.status === 'success') {
        setMensajeExito("📧 ¡Enviado! Revisa tu correo (Mailtrap) para restablecer la clave.");
      } else {
        setError(r.message);
      }
    } catch (err) {
      setError("Error al conectar con el servidor de recuperación");
    } finally {
      setEnviandoMail(false); // Liberamos la interfaz
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
      <div className="bg-white p-10 rounded-[35px] shadow-2xl w-full max-w-md border border-gray-100 relative overflow-hidden">
        
        {/* Overlay de Carga para el Mail */}
        {enviandoMail && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center animate-in fade-in duration-300">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-black text-blue-600 text-sm animate-pulse">ENVIANDO CORREO DE RECUPERACIÓN...</p>
            <p className="text-[10px] text-gray-400 mt-2">Por favor, espera un momento</p>
          </div>
        )}

        <div className="text-center mb-10">
          <div className="bg-blue-600 w-16 h-16 rounded-2xl text-white text-3xl font-black flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
            AS
          </div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tighter">AeroSamec</h2>
          <p className="text-gray-400 font-medium mt-1">Ingresa a tu panel de control</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-sm font-bold mb-6 border border-red-100">
            ⚠️ {error}
          </div>
        )}

        {mensajeExito && (
          <div className="bg-green-50 text-green-600 p-4 rounded-2xl text-sm font-bold mb-6 border border-green-100">
             {mensajeExito}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">DNI de Usuario</label>
            <input 
              required
              type="text" 
              className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-gray-700"
              placeholder="Número de documento"
              onChange={e => setDatos({...datos, dni: e.target.value})}
            />
          </div>

          <div className="relative">
            <input 
              required
              type={verPassword ? "text" : "password"}
              className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-gray-700 pr-12"
              placeholder="••••••••"
              onChange={e => setDatos({...datos, password: e.target.value})}
            />
            <button 
              type="button"
              onClick={() => setVerPassword(!verPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
            >
              {/* 2. Lógica de cambio de icono */}
              {verPassword ? (
                <EyeOff size={22} strokeWidth={2.5} /> 
              ) : (
                <Eye size={22} strokeWidth={2.5} />
              )}
            </button>
          </div>

          <button 
            disabled={cargando || enviandoMail}
            type="submit"
            className={`w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all ${(cargando || enviandoMail) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {cargando ? 'VALIDANDO...' : 'INICIAR SESIÓN'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;