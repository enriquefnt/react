import { useState } from 'react';

const TAREAS_BASICAS = [
  "Auditoria", "Supervisión de equipos", "Control de stock", 
  "Resolución de conflictos", "Atención clientes", "Otros"
];

const FormularioInforme = ({ usuario }) => {
  const [tareasSeleccionadas, setTareasSeleccionadas] = useState([]);
  const [otraTarea, setOtraTarea] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [enviado, setEnviado] = useState(false);

  const toggleTarea = (tarea) => {
    if (tareasSeleccionadas.includes(tarea)) {
      setTareasSeleccionadas(tareasSeleccionadas.filter(t => t !== tarea));
    } else {
      setTareasSeleccionadas([...tareasSeleccionadas, tarea]);
    }
  };

  const enviarInforme = async (e) => {
    e.preventDefault();
    
    // Preparar lista final de tareas
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
      const res = await fetch("http://localhost/api-equipo/guardar_informe.php", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });
      if (res.ok) {
        setEnviado(true);
        setTimeout(() => setEnviado(false), 3000);
        setTareasSeleccionadas([]);
        setObservaciones('');
        setOtraTarea('');
      }
    } catch (err) { alert("Error al conectar con el servidor"); }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Informe Diario de Tareas</h2>
      <p className="text-gray-400 text-sm mb-6">Fecha: {new Date().toLocaleDateString('es-AR')} - Usuario: {usuario.nombre}</p>

      {enviado && (
        <div className="bg-green-100 text-green-700 p-4 rounded-xl mb-6 text-center font-bold">
          ¡Informe enviado correctamente! ✅
        </div>
      )}

      <form onSubmit={enviarInforme} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3 uppercase">Seleccione Tareas Realizadas:</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {TAREAS_BASICAS.map(tarea => (
              <button
                key={tarea} type="button"
                onClick={() => toggleTarea(tarea)}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  tareasSeleccionadas.includes(tarea) 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-100 bg-gray-50 text-gray-600'
                }`}
              >
                {tarea}
              </button>
            ))}
          </div>
        </div>

        {tareasSeleccionadas.includes("Otros") && (
          <input
            type="text" placeholder="Especifique otras tareas..."
            className="w-full p-4 bg-gray-50 border-2 border-blue-100 rounded-2xl outline-none focus:border-blue-500"
            value={otraTarea} onChange={(e) => setOtraTarea(e.target.value)}
            required
          />
        )}

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Observaciones:</label>
          <textarea
            className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-500 h-32"
            placeholder="Detalles adicionales del día..."
            value={observaciones} onChange={(e) => setObservaciones(e.target.value)}
          />
        </div>

        <button className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg hover:bg-blue-700 transition-all">
          Enviar Informe Diario
        </button>
      </form>
    </div>
  );
};

export default FormularioInforme;