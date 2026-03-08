import React from 'react';
import { PartyPopper, RotateCcw, Home } from 'lucide-react';

export default function StudySuccess({ onRepeat, onHome }) {
  return (
    <div className="max-w-xl mx-auto text-center py-12 animate-in fade-in zoom-in">
      <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <PartyPopper size={48} />
      </div>
      <h2 className="text-4xl font-black mb-4 dark:text-white">¡Materia Dominada!</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-10 text-lg">Has completado todas las tarjetas de esta sesión.</p>
      
      <div className="flex flex-col gap-4">
        <button onClick={onRepeat} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-indigo-700 shadow-xl transition-all">
          <RotateCcw size={20} /> REPETIR SESIÓN
        </button>
        <button onClick={onHome} className="w-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-slate-50 transition-all">
          <Home size={20} /> VOLVER AL INICIO
        </button>
      </div>
    </div>
  );
}
