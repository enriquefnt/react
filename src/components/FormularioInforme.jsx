import { useState } from 'react';
import { CheckCircle, FileText, Send, Calendar, User, MessageSquare } from 'lucide-react';
import CONFIG from '../config'; 

const TAREAS_BASICAS = [
  "Auditoria", "Supervisión de equipos", "Control de stock", 
  "Resolución de conflictos", "Atención clientes", "Otros"
];

const FormularioInforme = ({ usuario }) => {
  const [tareasSeleccionadas, setTareasSeleccionadas] = useState([]);
  const [otraTarea, setOtraTarea] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);

  const toggleTarea = (tarea) => {
    if (tareasSeleccionadas.includes(tarea)) {
      setTareasSeleccionadas(tareasSeleccionadas.filter(t => t !== tarea));
    } else {
      setTareasSeleccionadas([...tareasSeleccionadas, tarea]);
    }
  };

  const enviarInforme = async (e) => {
    e.preventDefault();
    if (tareasSeleccionadas.length === 0) {
        alert("Por favor, seleccione al menos una tarea.");
        return;
    }

    setCargando(true);
    let listaFinal = [...tareasSeleccionadas];
    if (listaFinal.includes("Otros") && otraTarea) {
      listaFinal = listaFinal.map(t => t === "Otros" ? `Otros: ${otraTarea}` : t);
    }

    const datos = {
      dni: usuario.dni,
      tareas: listaFinal,
      observaciones: observaciones
    };

    try {
        const res = await fetch(`${CONFIG.API_URL}/guardar_informe.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });
      if (res.ok) {
        setEnviado(true);
        setTimeout(() => setEnviado(false), 4000);
        setTareasSeleccionadas([]);
        setObservaciones('');
        setOtraTarea('');
      }
    } catch (err) { 
        alert("Error al conectar con el servidor"); 
    } finally {
        setCargando(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 relative overflow-hidden">
        
        {/* Decoración Superior */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

        {/* Encabezado del Formulario */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
                <h2 className="text-3xl font-black text-gray-800 tracking-tight flex items-center gap-3">
                    <FileText className="text-blue-600" size={32} />
                    Informe Diario
                </h2>
                <div className="flex gap-4 mt-2">
                    <span className="flex items-center gap-1.5 text-[10px] font-black uppercase text-gray-400 tracking-widest bg-gray-50 px-3 py-1 rounded-full">
                        <Calendar size={12} className="text-blue-500" />
                        {new Date().toLocaleDateString('es-AR')}
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] font-black uppercase text-gray-400 tracking-widest bg-gray-50 px-3 py-1 rounded-full">
                        <User size={12} className="text-blue-500" />
                        {usuario.nombre}
                    </span>
                </div>
            </div>
        </div>

        {enviado && (
          <div className="bg-green-50 border-2 border-green-100 text-green-600 p-6 rounded-[25px] mb-8 flex items-center justify-center gap-3 animate-bounce">
            <CheckCircle size={24} strokeWidth={3} />
            <span className="font-black uppercase text-sm tracking-widest">¡Informe enviado con éxito!</span>
          </div>
        )}

        <form onSubmit={enviarInforme} className="space-y-8">
          
          {/* SECCIÓN TAREAS */}
          <div>
            <label className="text-[11px] font-black text-blue-500 uppercase ml-1 tracking-[0.2em] mb-4 block">Tareas del Turno</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TAREAS_BASICAS.map(tarea => (
                <button
                  key={tarea} type="button"
                  onClick={() => toggleTarea(tarea)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between group ${
                    tareasSeleccionadas.includes(tarea) 
                    ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-100' 
                    : 'border-gray-50 bg-gray-50 text-gray-500 hover:border-blue-200'
                  }`}
                >
                  <span className="font-bold text-sm">{tarea}</span>
                  {tareasSeleccionadas.includes(tarea) && <CheckCircle size={18} />}
                </button>
              ))}
            </div>
          </div>

          {/* INPUT EXTRA PARA "OTROS" */}
          {tareasSeleccionadas.includes("Otros") && (
            <div className="animate-in slide-in-from-top-2">
                <input
                    type="text" placeholder="Especifique qué otras tareas realizó..."
                    className="w-full p-4 bg-white border-2 border-blue-100 rounded-2xl outline-none focus:border-blue-500 font-bold text-sm text-gray-700 placeholder:text-gray-300 shadow-sm"
                    value={otraTarea} onChange={(e) => setOtraTarea(e.target.value)}
                    required
                />
            </div>
          )}

          {/* SECCIÓN OBSERVACIONES */}
          <div>
            <label className="text-[11px] font-black text-blue-500 uppercase ml-1 tracking-[0.2em] mb-4 block">Novedades y Observaciones</label>
            <div className="relative">
                <textarea
                    className="w-full p-5 bg-gray-50 border-2 border-gray-50 rounded-[25px] outline-none focus:border-blue-500 focus:bg-white h-40 font-medium text-gray-700 transition-all resize-none shadow-inner"
                    placeholder="Escriba aquí cualquier novedad relevante del día..."
                    value={observaciones} onChange={(e) => setObservaciones(e.target.value)}
                />
                <MessageSquare className="absolute bottom-4 right-4 text-gray-200" size={24} />
            </div>
          </div>

          {/* BOTÓN DE ENVÍO */}
          <button 
            disabled={cargando}
            className={`w-full py-5 rounded-[25px] font-black uppercase text-xs tracking-[0.25em] flex items-center justify-center gap-3 transition-all shadow-xl ${
                cargando 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.02] shadow-blue-100'
            }`}
          >
            {cargando ? (
                <span>Procesando...</span>
            ) : (
                <>
                    <Send size={18} />
                    Enviar Informe Diario
                </>
            )}
          </button>
        </form>
      </div>
      
      {/* Aviso de seguridad debajo del form */}
      <p className="text-center mt-6 text-[10px] text-gray-300 font-bold uppercase tracking-widest">
        Este informe será auditado por la supervisión correspondiente
      </p>
    </div>
  );
};

export default FormularioInforme;