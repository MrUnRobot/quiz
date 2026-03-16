import React from 'react';
import { CheckCircle2, XCircle, Home, RotateCcw } from 'lucide-react';

export default function Results({ questions, answers, onReset }) {
  const score = questions.reduce((acc, q, idx) => {
    return acc + (answers[idx] === q.correcta ? 1 : 0);
  }, 0);

  const percentage = Math.round((score / questions.length) * 100);

  return (
    <div className="w-full max-w-2xl mx-auto px-1 pb-10 animate-slide-up overflow-x-hidden">
      {/* Tarjeta de Puntaje */}
      <div className="custom-card p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] text-center mb-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 mb-4">
          <span className="text-3xl font-black">{percentage}%</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black mb-2">¡Examen Terminado!</h2>
        <p className="opacity-60 font-medium text-sm sm:text-base">
          Has acertado {score} de {questions.length} preguntas
        </p>
      </div>

      {/* Lista de Revisión */}
      <div className="space-y-4">
        {questions.map((q, idx) => (
          <div key={idx} className="custom-card p-4 sm:p-5 rounded-[1.5rem] sm:rounded-[2rem] border-l-4 sm:border-l-8 border-l-transparent flex flex-col min-w-0" 
               style={{ borderLeftColor: answers[idx] === q.correcta ? '#22c55e' : '#ef4444' }}>
            
            {/* Pregunta */}
            <div className="flex gap-2 sm:gap-3 mb-4 min-w-0">
              <div className="shrink-0 mt-1">
                {answers[idx] === q.correcta ? (
                  <CheckCircle2 className="text-green-500" size={18} />
                ) : (
                  <XCircle className="text-red-500" size={18} />
                )}
              </div>
              <h4 className="font-bold leading-tight text-sm sm:text-base break-words hyphens-auto min-w-0 flex-1">
                {q.pregunta}
              </h4>
            </div>

            {/* Opciones con corrección de desborde */}
            <div className="grid gap-2 sm:ml-8 min-w-0">
              <div className="text-xs sm:text-sm p-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 break-words min-w-0 overflow-hidden">
                <span className="font-black text-[9px] sm:text-[10px] uppercase opacity-40 block mb-1">Tu respuesta</span>
                <span className={`block font-bold ${answers[idx] === q.correcta ? "text-green-600" : "text-red-600"}`}>
                  {q['opcion_' + (answers[idx]?.toLowerCase() || 'a')]}
                </span>
              </div>
              
              {answers[idx] !== q.correcta && (
                <div className="text-xs sm:text-sm p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 break-words min-w-0 overflow-hidden">
                  <span className="font-black text-[9px] sm:text-[10px] uppercase text-green-600 opacity-60 block mb-1">Respuesta correcta</span>
                  <span className="block text-green-700 dark:text-green-400 font-bold">
                    {q['opcion_' + q.correcta.toLowerCase()]}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Botones */}
      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <button 
          onClick={onReset}
          className="flex-1 py-4 bg-slate-200 dark:bg-slate-800 rounded-xl font-black uppercase text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <Home size={16} /> Inicio
        </button>
        <button 
          onClick={() => window.location.reload()}
          className="flex-1 py-4 bg-indigo-600 text-white rounded-xl font-black uppercase text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
        >
          <RotateCcw size={16} /> Reintentar
        </button>
      </div>
    </div>
  );
}
