import { useState } from 'react';

const Login = ({ onLogin }) => {
  const [datos, setDatos] = useState({ dni: '', password: '' });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
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
      setError("Error de conexión con el servidor PHP");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-200">
        <div className="text-center mb-8">
          <div className="bg-blue-600 w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-white text-3xl mb-4 shadow-lg">
            🔐
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Bienvenido</h2>
          <p className="text-gray-400 text-sm">Ingresa tus datos para continuar</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold mb-4 text-center animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">DNI Usuario</label>
            <input 
              required
              type="text" 
              className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-500 transition-all"
              placeholder="Tu número de documento"
              onChange={e => setDatos({...datos, dni: e.target.value})}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Contraseña</label>
            <input 
              required
              type="password" 
              className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-500 transition-all"
              placeholder="••••••••"
              onChange={e => setDatos({...datos, password: e.target.value})}
            />
          </div>

          <button 
            disabled={cargando}
            className={`w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg transition-all ${cargando ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
          >
            {cargando ? 'Verificando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;