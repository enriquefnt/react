import React, { useState, useEffect } from 'react';
import { ClipboardList, User, Stethoscope, Plane, Save, Trash2, MapPin, X } from 'lucide-react';
import toast from 'react-hot-toast';

const VistaCoordinador = ({ usuarioLogueado, API_URL, isOpen, onClose }) => {
  const initialState = {
    paciente_nombre: '', paciente_apellido: '', paciente_dni: '', 
    paciente_sexo: 'Masculino', fecha_nacimiento: '', edad_formato: '',
    domicilio: '', localidad: '', hospital_origen: '', hospital_receptor: '',
    diagnosticos: '', codigo_triage: 'Verde', tipo_paciente: 'Adulto',
    medico_traslado: '', enfermero_traslado: '', aeronave_asignada: '', 
    piloto_asignado: '', eta_despegue: ''
  };

  const [formData, setFormData] = useState(initialState);

  // EFECTO PARA CALCULAR EDAD AUTOMÁTICAMENTE
  useEffect(() => {
    if (formData.fecha_nacimiento) {
      const cumple = new Date(formData.fecha_nacimiento);
      const hoy = new Date();
      
      let anos = hoy.getFullYear() - cumple.getFullYear();
      let meses = hoy.getMonth() - cumple.getMonth();
      let dias = hoy.getDate() - cumple.getDate();

      if (dias < 0) {
        meses--;
        const ultimoDiaMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth(), 0).getDate();
        dias += ultimoDiaMesAnterior;
      }
      if (meses < 0) {
        anos--;
        meses += 12;
      }

      let resultado = "";
      if (anos < 1) {
        resultado = `${meses} M ${dias} D`;
      } else {
        resultado = `${anos} A ${meses} M`;
      }
      setFormData(prev => ({ ...prev, edad_formato: resultado }));
    }
  }, [formData.fecha_nacimiento]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!isOpen) return null; // Si no está abierta la modal, no renderiza nada

  const labelStyle = "block text-[10px] font-bold text-slate-500 uppercase mb-1 ml-1";
  const inputStyle = "w-full p-1.5 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-white text-xs transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl max-h-[95vh] overflow-y-auto rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* CABECERA MODAL */}
        <div className="sticky top-0 z-10 bg-slate-800 p-4 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ClipboardList size={20} className="text-blue-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider">Nuevo Registro de Traslado</h2>
          </div>
          <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form className="p-5 space-y-5">
          
          {/* GRUPO 1: IDENTIDAD Y EDAD */}
          <section className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 text-blue-700 font-bold uppercase text-[10px] mb-3">
              <User size={12}/> Identificación del Paciente
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="md:col-span-1">
                <label className={labelStyle}>DNI</label>
                <input name="paciente_dni" placeholder="Sin puntos" onChange={handleChange} value={formData.paciente_dni} className={inputStyle} />
              </div>
              <div className="md:col-span-1">
                <label className={labelStyle}>Nombre</label>
                <input name="paciente_nombre" onChange={handleChange} value={formData.paciente_nombre} className={inputStyle} />
              </div>
              <div className="md:col-span-1">
                <label className={labelStyle}>Apellido</label>
                <input name="paciente_apellido" onChange={handleChange} value={formData.paciente_apellido} className={inputStyle} />
              </div>
              <div className="md:col-span-1">
                <label className={labelStyle}>Nacimiento</label>
                <input type="date" name="fecha_nacimiento" onChange={handleChange} value={formData.fecha_nacimiento} className={inputStyle} />
              </div>
              <div className="md:col-span-1">
                <label className={labelStyle}>Edad Calc.</label>
                <input name="edad_formato" value={formData.edad_formato} readOnly className={`${inputStyle} bg-blue-100 font-bold text-blue-700 border-blue-200`} />
              </div>
            </div>
          </section>

          {/* GRUPO 2: UBICACIÓN Y CLÍNICA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-700 font-bold uppercase text-[10px] border-b pb-1">
                <MapPin size={12}/> Ubicación y Contacto
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={labelStyle}>Localidad</label>
                  <input name="localidad" placeholder="Buscar..." onChange={handleChange} value={formData.localidad} className={inputStyle} />
                </div>
                <div>
                  <label className={labelStyle}>Domicilio</label>
                  <input name="domicilio" placeholder="Calle y N°" onChange={handleChange} value={formData.domicilio} className={inputStyle} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={labelStyle}>Origen</label>
                  <input name="hospital_origen" placeholder="Hosp. Emisor" onChange={handleChange} value={formData.hospital_origen} className={inputStyle} />
                </div>
                <div>
                  <label className={labelStyle}>Destino</label>
                  <input name="hospital_receptor" placeholder="Hosp. Receptor" onChange={handleChange} value={formData.hospital_receptor} className={inputStyle} />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-red-700 font-bold uppercase text-[10px] border-b pb-1">
                <Stethoscope size={12}/> Triage y Diagnóstico
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select name="codigo_triage" onChange={handleChange} value={formData.codigo_triage} className={`${inputStyle} font-bold`}>
                  <option value="Verde">🟢 VERDE</option>
                  <option value="Amarillo">🟡 AMARILLO</option>
                  <option value="Rojo">🔴 ROJO</option>
                </select>
                <select name="tipo_paciente" onChange={handleChange} value={formData.tipo_paciente} className={inputStyle}>
                  <option value="Adulto">Adulto</option>
                  <option value="Pediátrico">Pediátrico</option>
                  <option value="Neonatal">Neonatal</option>
                </select>
              </div>
              <textarea name="diagnosticos" placeholder="Breve descripción del cuadro..." onChange={handleChange} value={formData.diagnosticos} className={`${inputStyle} h-[68px] resize-none`} />
            </div>
          </div>

          {/* GRUPO 3: EQUIPO Y AERONAVE */}
          <section className="bg-blue-50 p-3 rounded-xl border border-blue-100 space-y-3">
            <div className="flex items-center gap-2 text-blue-900 font-bold uppercase text-[10px] border-b border-blue-200 pb-1">
              <Plane size={12}/> Misión Aero-médica
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className={labelStyle}>Matrícula</label>
                <input name="aeronave_asignada" placeholder="LV-..." onChange={handleChange} value={formData.aeronave_asignada} className={inputStyle} />
              </div>
              <div>
                <label className={labelStyle}>Médico</label>
                <input name="medico_traslado" onChange={handleChange} value={formData.medico_traslado} className={inputStyle} />
              </div>
              <div>
                <label className={labelStyle}>Enfermero</label>
                <input name="enfermero_traslado" onChange={handleChange} value={formData.enfermero_traslado} className={inputStyle} />
              </div>
              <div>
                <label className={labelStyle}>ETD/ETA</label>
                <input type="datetime-local" name="eta_despegue" onChange={handleChange} value={formData.eta_despegue} className={inputStyle} />
              </div>
            </div>
          </section>

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-2 rounded-lg text-xs transition-all">
              CANCELAR
            </button>
            <button type="submit" className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg text-xs shadow-md transition-all flex items-center justify-center gap-2">
              <Save size={14} /> GUARDAR REGISTRO
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VistaCoordinador;