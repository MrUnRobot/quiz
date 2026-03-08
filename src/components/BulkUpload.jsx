import React, { useRef } from 'react';
import Papa from 'papaparse';
import { Upload, FileText, ChevronLeft } from 'lucide-react';

export default function BulkUpload({ onDataReady, onCancel }) {
  const fileInput = useRef();

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    
    Papa.parse(f, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Pasamos los datos y el nombre del archivo al padre
        onDataReady(results.data, f.name);
      }
    });
  };

  return (
    <div className="max-w-xl mx-auto animate-slide-up">
      <button onClick={onCancel} className="mb-6 flex items-center gap-2 font-bold text-slate-500 hover:text-indigo-600 transition-colors">
        <ChevronLeft size={20} /> VOLVER A LA BIBLIOTECA
      </button>
      
      <div className="custom-card p-10 rounded-[2.5rem] shadow-2xl text-center">
        <div className="bg-indigo-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 text-white shadow-xl shadow-indigo-200 dark:shadow-none">
          <Upload size={40} />
        </div>
        
        <h2 className="text-3xl font-black mb-4 dark:text-white">Nueva Guía de Estudio</h2>
        <p className="opacity-50 mb-10 text-lg">Sube un archivo CSV con tus preguntas para empezar a practicar.</p>
        
        <div 
          onClick={() => fileInput.current.click()} 
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-[2rem] p-16 cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-all group"
        >
          <input type="file" ref={fileInput} accept=".csv" onChange={handleFile} className="hidden" />
          <FileText className="mx-auto mb-4 text-slate-300 group-hover:text-indigo-500 transition-colors scale-125" size={48} />
          <p className="font-black text-xl dark:text-slate-300">Seleccionar archivo .CSV</p>
          <p className="text-sm opacity-40 mt-2 font-medium">Formato: pregunta, opcion_a, opcion_b, correcta...</p>
        </div>
      </div>
    </div>
  );
}
