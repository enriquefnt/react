import { useState, useEffect } from 'react';

const VistaSupervisor = () => {
  const [informes, setInformes] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    consultarAPI();
  }, []);

  const consultarAPI = async () => {
    try {
      const res = await fetch("http://localhost/api-equipo/obtener_informes.php");
      const data = await res.json();
      setInformes(data);
    } catch (err) {
      console.error("Error cargando informes:", err);
    } finally {
      setCargando(false);
    }
  };

  const guardarNota = async (id, nota) => {
    try {
      await fetch("http://localhost/api-equipo/actualizar_obs_supervisor.php", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, nota })
      });
    } catch (err) {
      alert("Error al conectar con el servidor");
    }
  };

  const informesFiltrados = informes.filter(inf => {
    const t = filtro.toLowerCase();
    const fechaISO = new Date(inf.fecha_hora);
    const fechaFormateada = fechaISO.toLocaleDateString('es-AR', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });

    return (
      inf.nombre?.toLowerCase().includes(t) ||
      inf.tareas?.toLowerCase().includes(t) ||
      inf.rol?.toLowerCase().includes(t) ||
      fechaFormateada.includes(t)
    );
  });

  if (cargando) return <div className="p-20 text-center font-bold text-gray-400">Cargando informes...</div>;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 text-center md:text-left">
          Extracto de Actividad <span className="text-blue-500 text-sm block md:inline md:ml-2">Control General</span>
        </h2>
        <div className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="Buscar por nombre, fecha (dd/mm/aaaa) o tarea..."
            className="w-full pl-5 pr-4 py-3 bg-white border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-500 transition-all shadow-sm"
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="p-5">Fecha y Hora</th>
                <th className="p-5">Empleado</th>
                <th className="p-5">Tareas Realizadas</th>
                <th className="p-5">Observaciones Empleado</th>
                <th className="p-5">Nota Supervisor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {informesFiltrados.length > 0 ? (
                informesFiltrados.map(inf => (
                  <tr key={inf.id} className="hover:bg-blue-50/20 transition-colors">
                    {/* COLUMNA 1: FECHA FORZADA DD/MM/AAAA */}
                    <td className="p-5 text-sm">
                      <div className="font-bold text-gray-800">
                        {new Date(inf.fecha_hora).toLocaleDateString('es-AR', {day:'2-digit', month:'2-digit', year:'numeric'})}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(inf.fecha_hora).toLocaleTimeString('es-AR', {hour:'2-digit', minute:'2-digit'})} hs
                      </div>
                    </td>

                    {/* COLUMNA 2: EMPLEADO */}
                    <td className="p-5">
                      <p className="font-bold text-gray-800 text-sm leading-tight">{inf.nombre}</p>
                      <span className="text-[10px] text-blue-500 font-bold uppercase">{inf.rol}</span>
                    </td>

                    {/* COLUMNA 3: TAREAS */}
                    <td className="p-5">
                      <div className="flex flex-wrap gap-1">
                        {inf.tareas.split(',').map((t, i) => (
                          <span key={i} className="bg-blue-50 text-blue-600 px-2 py-1 rounded-lg text-[10px] font-bold border border-blue-100 uppercase">
                            {t.trim()}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* COLUMNA 4: OBSERVACIONES EMPLEADO (La que se había perdido) */}
                    <td className="p-5 text-sm text-gray-500 italic max-w-xs">
                      {inf.observaciones || <span className="text-gray-300">Sin comentarios</span>}
                    </td>

                    {/* COLUMNA 5: NOTA SUPERVISOR */}
                    <td className="p-5">
                      <textarea 
                        className="w-full p-3 text-xs border border-gray-100 rounded-xl focus:border-blue-300 outline-none bg-gray-50/50 focus:bg-white transition-all resize-none"
                        placeholder="Escribir feedback..."
                        rows="2"
                        defaultValue={inf.obs_supervisor}
                        onBlur={(e) => guardarNota(inf.id, e.target.value)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-20 text-center text-gray-400">No se encontraron resultados</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VistaSupervisor;