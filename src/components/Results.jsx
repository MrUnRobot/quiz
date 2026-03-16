import React from 'react';
import { CheckCircle2, XCircle, Home, RotateCcw } from 'lucide-react';

export default function Results({ questions, answers, onReset }) {
  const score = questions.reduce((acc, q, idx) => {
    return acc + (answers[idx] === q.correcta ? 1 : 0);
  }, 0);

  const percentage = Math.round((score / questions.length) * 100);

  return (
    <div className="max-w-2xl mx-auto px-2 pb-10 animate-slide-up">
      {/* Tarjeta de Puntaje */}
      <div className="custom-card p-8 rounded-[2.5rem] text-center mb-8">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 mb-4">
          <span className="text-4xl font-black">{percentage}%</span>
        </div>
        <h2 className="text-3xl font-black mb-2">¡Examen Terminado!</h2>
        <p className="opacity-60 font-medium">
          Has acertado {score} de {questions.length} preguntas
        </p>
      </div>

      {/* Lista de Revisión */}
      <div className="space-y-4">
        {questions.map((q, idx) => (
          <div key={idx} className="custom-card p-5 rounded-[2rem] border-l-8 border-l-transparent overflow-hidden" 
               style={{ borderLeftColor: answers[idx] === q.correcta ? '#22c55e' : '#ef4444' }}>
            
            {/* Pregunta con ajuste de texto para móviles */}
            <div className="flex gap-3 mb-4">
              {answers[idx] === q.correcta ? (
                <CheckCircle2 className="text-green-500 shrink-0" size={20} />
              ) : (
                <XCircle className="text-red-500 shrink-0" size={20} />
              )}
              <h4 className="font-bold leading-tight break-words overflow-hidden">
                {q.pregunta}
              </h4>
            </div>

            {/* Opciones */}
            <div className="grid gap-2 ml-8">
              <div className="text-sm p-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 break-words">
                <span className="font-black text-[10px] uppercase opacity-40 block mb-1">Tu respuesta</span>
                <span className={answers[idx] === q.correcta ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                  {q['opcion_' + (answers[idx]?.toLowerCase() || 'a')]}
                </span>
              </div>
              
              {answers[idx] !== q.correcta && (
                <div className="text-sm p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 break-words">
                  <span className="font-black text-[10px] uppercase text-green-600 opacity-60 block mb-1">Respuesta correcta</span>
                  <span className="text-green-700 dark:text-green-400 font-bold">
                    {q['opcion_' + q.correcta.toLowerCase()]}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Botones de acción */}
      <div className="flex flex-col sm:flex-row gap-4 mt-10">
        <button 
          onClick={onReset}
          className="flex-1 py-5 bg-slate-200 dark:bg-slate-800 rounded-2xl font-black uppercase text-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <Home size={18} /> Inicio
        </button>
        <button 
          onClick={() => window.location.reload()}
          className="flex-1 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-none active:scale-95 transition-all"
        >
          <RotateCcw size={18} /> Reintentar
        </button>
      </div>
    </div>
  );
}
