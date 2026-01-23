import { useState, useEffect } from 'react';
import { Search, Calendar, User, ClipboardList, MessageSquare, CheckCircle2, Loader2 } from 'lucide-react';
import CONFIG from '../config';

const VistaCoordinador = () => {
  const [informes, setInformes] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [cargando, setCargando] = useState(true);
  const [guardandoId, setGuardandoId] = useState(null);

  useEffect(() => {
    consultarAPI();
  }, []);

  const consultarAPI = async () => {
    try {
      const res = await fetch(`${CONFIG.API_URL}/obtener_informes.php`);
      const data = await res.json();
      setInformes(data);
    } catch (err) {
      console.error("Error cargando informes:", err);
    } finally {
      setCargando(false);
    }
  };

  const guardarNota = async (id, nota) => {
    setGuardandoId(id);
    try {
      await fetch(`${CONFIG.API_URL}/actualizar_obs_Coordinador.ph`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, nota })
      });
      // Opcional: Pequeña pausa visual para mostrar el check de éxito
      setTimeout(() => setGuardandoId(null), 1000);
    } catch (err) {
      alert("Error al conectar con el servidor");
      setGuardandoId(null);
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

  if (cargando) return (
    <div className="flex flex-col items-center justify-center p-20 gap-4 text-gray-400">
      <Loader2 className="animate-spin text-blue-500" size={40} />
      <p className="font-black uppercase text-xs tracking-[0.2em]">Sincronizando Informes...</p>
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-full">
      {/* ENCABEZADO Y BUSCADOR */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight flex items-center gap-3">
            <ClipboardList className="text-blue-600" size={32} />
            Extracto de Actividad
          </h2>
          <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mt-1 ml-1">Auditoría y Control de Equipo</p>
        </div>

        <div className="relative w-full lg:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por empleado, fecha o tarea..."
            className="w-full pl-12 pr-6 py-4 bg-white border-2 border-gray-50 rounded-[20px] outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm font-bold text-sm text-gray-700 placeholder:text-gray-300"
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>
      </div>

      {/* TABLA DE INFORMES */}
      <div className="bg-white rounded-[35px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="p-6 text-left">Fecha / Hora</th>
                <th className="p-6 text-left">Responsable</th>
                <th className="p-6 text-left">Tareas Realizadas</th>
                <th className="p-6 text-left">Observaciones Empleado</th>
                <th className="p-6 text-left">Feedback Coordinador</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {informesFiltrados.length > 0 ? (
                informesFiltrados.map(inf => (
                  <tr key={inf.id} className="hover:bg-blue-50/30 transition-all group">
                    
                    {/* FECHA Y HORA */}
                    <td className="p-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gray-50 rounded-xl text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                            <Calendar size={18} />
                        </div>
                        <div>
                            <div className="font-black text-gray-800 text-sm tracking-tighter">
                                {new Date(inf.fecha_hora).toLocaleDateString('es-AR', {day:'2-digit', month:'2-digit', year:'numeric'})}
                            </div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter leading-none">
                                {new Date(inf.fecha_hora).toLocaleTimeString('es-AR', {hour:'2-digit', minute:'2-digit'})} HS
                            </div>
                        </div>
                      </div>
                    </td>

                    {/* EMPLEADO (AVATAR + NOMBRE) */}
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-black text-xs border-2 border-white shadow-sm shrink-0">
                            {inf.nombre?.[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <p className="font-black text-gray-800 text-sm leading-tight truncate uppercase tracking-tighter">{inf.nombre}</p>
                            <span className="text-[9px] text-blue-500 font-black uppercase tracking-widest">{inf.rol}</span>
                        </div>
                      </div>
                    </td>

                    {/* TAREAS (BADGES) */}
                    <td className="p-6">
                      <div className="flex flex-wrap gap-1.5 max-w-xs">
                        {inf.tareas.split(',').map((t, i) => (
                          <span key={i} className="bg-white text-gray-600 px-3 py-1 rounded-lg text-[9px] font-black border border-gray-100 uppercase tracking-tighter shadow-sm">
                            {t.trim()}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* OBSERVACIONES EMPLEADO */}
                    <td className="p-6">
                        <div className="flex items-start gap-2 max-w-xs italic text-gray-500 text-xs">
                            <MessageSquare size={14} className="shrink-0 text-gray-300 mt-0.5" />
                            <p className="leading-relaxed">
                                {inf.observaciones || <span className="text-gray-300 font-normal">Sin comentarios adicionales</span>}
                            </p>
                        </div>
                    </td>

                    {/* NOTA Coordinador CON INDICADOR DE GUARDADO */}
                    <td className="p-6 min-w-[250px]">
                      <div className="relative">
                        <textarea 
                          className="w-full p-4 text-xs font-bold border-2 border-gray-50 rounded-2xl focus:border-blue-500 outline-none bg-gray-50/30 focus:bg-white transition-all resize-none text-gray-700 placeholder:font-normal placeholder:text-gray-300"
                          placeholder="Añadir feedback técnico..."
                          rows="2"
                          defaultValue={inf.obs_Coordinador}
                          onBlur={(e) => guardarNota(inf.id, e.target.value)}
                        />
                        <div className="absolute bottom-3 right-3">
                            {guardandoId === inf.id ? (
                                <Loader2 size={16} className="text-blue-500 animate-spin" />
                            ) : inf.obs_Coordinador ? (
                                <CheckCircle2 size={16} className="text-green-500 opacity-50" />
                            ) : null}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-32 text-center">
                    <div className="flex flex-col items-center gap-2">
                        <Search size={40} className="text-gray-100" />
                        <p className="text-gray-400 font-black uppercase text-xs tracking-widest">No hay registros para mostrar</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* ESPACIADOR PARA EL FOOTER FIJO */}
      <div className="h-24"></div>
    </div>
  );
};

export default VistaCoordinador;