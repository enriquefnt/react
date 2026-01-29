import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash, Filter, RefreshCw } from 'lucide-react';
import VistaCoordinador from './VistaCoordinador';
import toast from 'react-hot-toast';


const GestorTraslados = ({ usuarioLogueado, API_URL }) => {
  const [traslados, setTraslados] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [filtros, setFiltros] = useState({ busqueda: '' });

  // 1. FUNCIÓN DE BÚSQUEDA AL SERVIDOR
  const buscarEnServidor = async () => {
    setCargando(true);
    try {
      // Si hay búsqueda usamos el parámetro 'buscar', si no, traemos los últimos
      const url = filtros.busqueda.length > 0 
        ? `${API_URL}/traslados.php?buscar=${encodeURIComponent(filtros.busqueda)}`
        : `${API_URL}/traslados.php?limit=5`;

      const res = await fetch(url);
      const data = await res.json();
      
      // Validamos que la respuesta sea un array
      setTraslados(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error en la carga:", error);
      toast.error("Error de conexión con el servidor");
      setTraslados([]);
    } finally {
      setCargando(false);
    }
  };

  // 2. EFECTO PARA DISPARAR LA BÚSQUEDA (CON DEBOUNCE)
  useEffect(() => {
    const timer = setTimeout(() => {
      buscarEnServidor();
    }, 400); // Espera 400ms después de escribir para no saturar el server

    return () => clearTimeout(timer);
  }, [filtros.busqueda]);

  const handleEliminarLogico = async (id) => {
    if (!window.confirm("¿Desea quitar este traslado de la lista activa?")) return;
    // Aquí se implementaría el borrado lógico en BD
    toast.success("Traslado archivado localmente");
    setTraslados(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Gestión de Vuelos</h1>
          <p className="text-slate-500 text-sm font-medium">Panel de control y monitoreo aero-médico</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all transform active:scale-95"
        >
          <Plus size={20} /> NUEVA CARGA
        </button>
      </div>

      {/* BUSCADOR GLOBAL */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-3 text-slate-400" size={20} />
          <input 
            type="text"
            placeholder="Buscar por fecha (02/2025), apellido, aeronave o institución..."
            className="w-full pl-12 pr-4 py-3 bg-transparent text-sm focus:outline-none"
            value={filtros.busqueda}
            onChange={(e) => setFiltros({ busqueda: e.target.value })}
          />
        </div>
        {filtros.busqueda && (
          <button 
            onClick={() => setFiltros({ busqueda: '' })}
            className="text-xs font-bold text-red-500 px-4 hover:underline"
          >
            BORRAR BÚSQUEDA
          </button>
        )}
      </div>

      {/* TABLA DE RESULTADOS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500">
                <th className="p-4 text-[10px] font-black uppercase tracking-wider">Fecha/Hora</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-wider">Paciente</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-wider">Ruta (Origen/Destino)</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-wider">Aeronave</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-wider text-center">Triage</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-wider text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {traslados.length > 0 ? traslados.map((t) => (
                <tr key={t.id} className="hover:bg-blue-50/40 transition-colors group">
                  <td className="p-4 text-xs font-semibold text-slate-600 whitespace-nowrap">
                    {t.eta_despegue || 'Pendiente'}
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-bold text-slate-800 leading-none mb-1">
                      {t.paciente_apellido}, {t.paciente_nombre}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono">DNI: {t.paciente_dni}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-slate-600"><b className="text-blue-600">O:</b> {t.hospital_origen}</span>
                      <span className="text-xs text-slate-600"><b className="text-green-600">D:</b> {t.hospital_receptor}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-md font-mono text-xs font-bold border border-slate-200 uppercase">
                      {t.aeronave_asignada || '---'}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${
                      t.codigo_triage === 'Rojo' ? 'bg-red-50 text-red-600 border-red-200' : 
                      t.codigo_triage === 'Amarillo' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' : 
                      'bg-green-50 text-green-600 border-green-200'
                    }`}>
                      {t.codigo_triage?.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-1">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="Editar">
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleEliminarLogico(t.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" 
                        title="Archivar"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="p-16 text-center text-slate-400 text-sm font-medium">
                    {cargando ? (
                      <div className="flex flex-col items-center gap-2">
                        <RefreshCw className="animate-spin text-blue-500" size={24} />
                        <p>Buscando registros...</p>
                      </div>
                    ) : "No se encontraron traslados con esos criterios."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE CARGA */}
      <VistaCoordinador 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        usuarioLogueado={usuarioLogueado}
        API_URL={API_URL}
        onSuccess={buscarEnServidor}
      />

    </div>
  );
};


export default GestorTraslados;