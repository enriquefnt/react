import React, { useState } from 'react';
import { ClipboardList, User, Stethoscope, Plane, Save, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const VistaCoordinador = ({ usuarioLogueado, API_URL }) => {
  const [formData, setFormData] = useState({
    paciente_nombre: '', paciente_apellido: '', paciente_sexo: 'Masculino',
    fecha_nacimiento: '', domicilio: '', localidad: '',
    hospital_origen: '', servicio_salud: '', solicitante_nombre: '', solicitante_cargo: '',
    motivo_traslado: '', diagnosticos: '', codigo_triage: 'Verde', tipo_paciente: 'Adulto',
    hospital_receptor: '', medico_traslado: '', enfermero_traslado: '',
    aeronave_asignada: '', piloto_asignado: '', eta_despegue: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- AQUÍ ESTABA EL ERROR: Faltaba definir esta función ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Verificación de Seguridad: Evita el error de Foreign Key en el servidor
    if (!usuarioLogueado || !usuarioLogueado.id) {
      console.error("DEBUG - Datos del usuario en el momento del error:", usuarioLogueado);
      return toast.error("Error de sesión: No se detecta el ID del operador. Por favor, cierra sesión y vuelve a entrar.");
    }

    // 2. Validación de campos obligatorios
    if (!formData.paciente_nombre || !formData.hospital_origen) {
      return toast.error("Por favor, completa al menos el nombre del paciente y el hospital de origen.");
    }

    const loadingToast = toast.loading("Registrando solicitud en la base de datos...");

    try {
      // Preparamos el paquete de datos
      const datosParaEnviar = {
        ...formData,
        id_operador_actual: usuarioLogueado.id // Este es el ID que el PHP usará para 'creado_por'
      };

      console.log("DEBUG - Enviando estos datos:", datosParaEnviar);

      const response = await fetch(`${API_URL}/traslados.php`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(datosParaEnviar)
      });

      // Verificamos si la respuesta es OK antes de intentar leer el JSON
      if (!response.ok) {
        const errorTexto = await response.text(); // Leemos el error del servidor (el 500)
        throw new Error(errorTexto || "Error interno del servidor (500)");
      }

      const res = await response.json();

      if (res.status === 'success') {
        toast.success("¡Traslado registrado con éxito!", { id: loadingToast });
        
        // Limpiamos el formulario para un nuevo registro
        setFormData({
          paciente_nombre: '', paciente_apellido: '', paciente_sexo: 'Masculino',
          fecha_nacimiento: '', domicilio: '', localidad: '',
          hospital_origen: '', servicio_salud: '', solicitante_nombre: '', solicitante_cargo: '',
          motivo_traslado: '', diagnosticos: '', codigo_triage: 'Verde', tipo_paciente: 'Adulto',
          hospital_receptor: '', medico_traslado: '', enfermero_traslado: '',
          aeronave_asignada: '', piloto_asignado: '', eta_despegue: ''
        });
      } else {
        throw new Error(res.message || "Error desconocido al guardar");
      }
    } catch (error) {
      console.error("Error detallado:", error);
      toast.error("No se pudo guardar: " + error.message, { id: loadingToast, duration: 6000 });
    }
  };
  
  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
          <h2 className="text-2xl font-black flex items-center gap-3">
            <ClipboardList size={30} /> GESTIÓN DE TRASLADOS
          </h2>
          <p className="opacity-80 text-sm">Registro de misiones aero-médicas</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-10">
          
          {/* SECCIÓN 1: FILIACIÓN */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-700 font-bold border-b pb-2 uppercase text-sm tracking-wider">
              <User size={18}/> Datos del Paciente
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input name="paciente_nombre" placeholder="Nombre" onChange={handleChange} className="p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-400 transition-all" />
              <input name="paciente_apellido" placeholder="Apellido" onChange={handleChange} className="p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-400 transition-all" />
              <select name="paciente_sexo" onChange={handleChange} className="p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-400">
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <input type="date" name="fecha_nacimiento" onChange={handleChange} className="p-3 bg-gray-50 border rounded-xl outline-none" />
               <input name="domicilio" placeholder="Domicilio" onChange={handleChange} className="p-3 bg-gray-50 border rounded-xl outline-none" />
               <input name="localidad" placeholder="Localidad" onChange={handleChange} className="p-3 bg-gray-50 border rounded-xl outline-none" />
            </div>
          </div>

          {/* SECCIÓN 2: DATOS MÉDICOS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-red-600 font-bold border-b pb-2 uppercase text-sm tracking-wider">
                <Stethoscope size={18}/> Evaluación Médica
              </div>
              <select name="codigo_triage" onChange={handleChange} className="w-full p-3 border-2 rounded-xl font-black text-center focus:ring-0">
                <option value="Verde" className="text-green-600">🟢 CÓDIGO VERDE</option>
                <option value="Amarillo" className="text-yellow-600">🟡 CÓDIGO AMARILLO</option>
                <option value="Rojo" className="text-red-600">🔴 CÓDIGO ROJO</option>
              </select>
              <textarea name="diagnosticos" placeholder="Diagnóstico y observaciones..." onChange={handleChange} className="w-full p-3 bg-gray-50 border rounded-xl h-28" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-blue-700 font-bold border-b pb-2 uppercase text-sm tracking-wider">
                <MapPin size={18}/> Origen y Solicitante
              </div>
              <input name="hospital_origen" placeholder="Hospital / Centro Emisor" onChange={handleChange} className="w-full p-3 bg-gray-50 border rounded-xl" />
              <input name="solicitante_nombre" placeholder="Médico que solicita" onChange={handleChange} className="w-full p-3 bg-gray-50 border rounded-xl" />
              <select name="tipo_paciente" onChange={handleChange} className="w-full p-3 bg-gray-50 border rounded-xl">
                <option value="Adulto">Adulto</option>
                <option value="Pediátrico">Pediátrico</option>
                <option value="Neonato">Neonato</option>
                <option value="Gestante">Gestante</option>
              </select>
            </div>
          </div>

          {/* SECCIÓN 3: PLAN DE TRASLADO */}
          <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 space-y-4">
            <div className="flex items-center gap-2 text-blue-900 font-black uppercase text-sm tracking-wider">
              <Plane size={20}/> Plan de Misión
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <input name="hospital_receptor" placeholder="Hospital Receptor" onChange={handleChange} className="p-3 bg-white border rounded-xl" />
               <input name="aeronave_asignada" placeholder="Matrícula Aeronave" onChange={handleChange} className="p-3 bg-white border rounded-xl" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <input name="piloto_asignado" placeholder="Piloto" onChange={handleChange} className="p-3 bg-white border rounded-xl" />
               <input type="datetime-local" name="eta_despegue" onChange={handleChange} className="p-3 bg-white border rounded-xl" />
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 transform hover:-translate-y-1">
            <Save size={24} /> GUARDAR REGISTRO DE TRASLADO
          </button>
        </form>
      </div>
    </div>
  );
};

export default VistaCoordinador;