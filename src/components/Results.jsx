import React from 'react';
import { CheckCircle2, XCircle, Home, RotateCcw } from 'lucide-react';

export default function Results({ questions, answers, onReset }) {
  const score = questions.reduce((acc, q, idx) => {
    return acc + (answers[idx] === q.correcta ? 1 : 0);
  }, 0);

  const percentage = Math.round((score / questions.length) * 100);

  return (
    <div className="w-full max-w-3xl mx-auto px-2 pb-10 animate-slide-up">
      {/* Resumen de Puntaje */}
      <div className="custom-card p-8 rounded-[2.5rem] text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 mb-4">
          <span className="text-3xl font-black">{percentage}%</span>
        </div>
        <h2 className="text-2xl font-black mb-1">Resultado Final</h2>
        <p className="opacity-60 font-bold">Lograste {score} de {questions.length} aciertos</p>
      </div>

      {/* Lista de Preguntas */}
      <div className="space-y-6">
        {questions.map((q, idx) => {
          const userAnswer = answers[idx];
          const isCorrect = userAnswer === q.correcta;

          return (
            <div key={idx} className="custom-card p-5 rounded-[2.5rem] border-t-4" 
                 style={{ borderTopColor: isCorrect ? '#22c55e' : '#ef4444' }}>
              
              <div className="flex gap-3 mb-5">
                <div className="shrink-0 mt-1">
                  {isCorrect ? <CheckCircle2 className="text-green-500" size={20} /> : <XCircle className="text-red-500" size={20} />}
                </div>
                <h3 className="font-bold text-lg leading-tight break-words min-w-0">
                  {q.pregunta}
                </h3>
              </div>

              {/* Malla de Opciones (Igual que en el examen) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {['A', 'B', 'C', 'D'].map((letter) => {
                  const optionText = q['opcion_' + letter.toLowerCase()];
                  const isCurrentOptionCorrect = letter === q.correcta;
                  const isCurrentOptionSelected = letter === userAnswer;

                  // Lógica de colores:
                  // 1. Si es la correcta -> Siempre Verde
                  // 2. Si es la que elegiste y está mal -> Rojo
                  // 3. El resto -> Neutral
                  let bgClass = "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700";
                  let textClass = "text-slate-600 dark:text-slate-400";
                  let circleClass = "bg-slate-200 dark:bg-slate-700 text-slate-500";

                  if (isCurrentOptionCorrect) {
                    bgClass = "bg-green-100 dark:bg-green-900/30 border-green-500";
                    textClass = "text-green-700 dark:text-green-300 font-bold";
                    circleClass = "bg-green-500 text-white";
                  } else if (isCurrentOptionSelected && !isCorrect) {
                    bgClass = "bg-red-100 dark:bg-red-900/30 border-red-500";
                    textClass = "text-red-700 dark:text-red-300 font-bold";
                    circleClass = "bg-red-500 text-white";
                  }

                  return (
                    <div key={letter} className={`flex items-center gap-3 p-3 rounded-2xl border transition-all min-w-0 ${bgClass}`}>
                      <span className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${circleClass}`}>
                        {letter}
                      </span>
                      <span className={`text-sm break-words leading-tight min-w-0 ${textClass}`}>
                        {optionText}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Botones de Navegación */}
      <div className="flex flex-col sm:flex-row gap-4 mt-12">
        <button onClick={onReset} className="flex-1 py-5 bg-slate-200 dark:bg-slate-800 rounded-2xl font-black uppercase text-sm flex items-center justify-center gap-2 active:scale-95 transition-all">
          <Home size={18} /> Menú Principal
        </button>
        <button onClick={() => window.location.reload()} className="flex-1 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all">
          <RotateCcw size={18} /> Reintentar Guía
        </button>
      </div>
    </div>
  );
}
