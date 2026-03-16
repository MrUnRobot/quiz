import React from 'react';
import { CheckCircle2, XCircle, Home, RotateCcw, Image as ImageIcon } from 'lucide-react';

export default function Results({ questions, answers, onReset }) {
  // Solo calculamos score si hay respuestas del usuario (Modo Examen)
  const hasUserAnswers = Object.keys(answers).length > 0;
  const score = questions.reduce((acc, q, idx) => acc + (answers[idx] === q.correcta ? 1 : 0), 0);
  const percentage = Math.round((score / questions.length) * 100);

  return (
    <div className="w-full max-w-3xl mx-auto px-2 pb-10 animate-slide-up">
      {hasUserAnswers && (
        <div className="custom-card p-8 rounded-[2.5rem] text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 mb-4">
            <span className="text-3xl font-black">{percentage}%</span>
          </div>
          <h2 className="text-2xl font-black mb-1">Resultado Final</h2>
          <p className="opacity-60 font-bold">Lograste {score} de {questions.length} aciertos</p>
        </div>
      )}

      <div className="space-y-8">
        {questions.map((q, idx) => {
          const userAnswer = answers[idx];
          const isCorrect = userAnswer === q.correcta;

          return (
            <div key={idx} className="custom-card p-6 rounded-[2.5rem] border-t-4" 
                 style={{ borderTopColor: !hasUserAnswers ? '#6366f1' : isCorrect ? '#22c55e' : '#ef4444' }}>
              
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex gap-3">
                  <div className="shrink-0 mt-1">
                    {!hasUserAnswers ? <div className="w-5 h-5 rounded-full bg-indigo-500" /> :
                     isCorrect ? <CheckCircle2 className="text-green-500" size={20} /> : <XCircle className="text-red-500" size={20} />}
                  </div>
                  <h3 className="font-bold text-lg leading-tight break-words flex-1">
                    {q.pregunta}
                  </h3>
                </div>

                {/* SOPORTE DE IMAGEN SIN BUGS */}
                {q.imagen_url && q.imagen_url.trim() !== "" && (
                  <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white p-2">
                    <img 
                      src={q.imagen_url} 
                      alt="Referencia visual" 
                      className="w-full h-auto max-h-[400px] object-contain mx-auto"
                      onError={(e) => {
                        e.target.parentElement.style.display = 'none'; // Oculta si el link falla
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {['A', 'B', 'C', 'D'].map((letter) => {
                  const optionText = q['opcion_' + letter.toLowerCase()];
                  const isCurrentOptionCorrect = letter === q.correcta;
                  const isCurrentOptionSelected = letter === userAnswer;

                  let bgClass = "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700";
                  let textClass = "text-slate-600 dark:text-slate-400";
                  let circleClass = "bg-slate-200 dark:bg-slate-700 text-slate-500";

                  if (isCurrentOptionCorrect) {
                    bgClass = "bg-green-100 dark:bg-green-900/30 border-green-500 ring-2 ring-green-500/20";
                    textClass = "text-green-700 dark:text-green-300 font-black";
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

      <div className="flex flex-col sm:flex-row gap-4 mt-12">
        <button onClick={onReset} className="flex-1 py-5 bg-slate-200 dark:bg-slate-800 rounded-2xl font-black uppercase text-sm flex items-center justify-center gap-2 active:scale-95 transition-all">
          <Home size={18} /> Inicio
        </button>
        <button onClick={() => window.location.reload()} className="flex-1 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all">
          <RotateCcw size={18} /> {hasUserAnswers ? 'Reintentar' : 'Volver a ver'}
        </button>
      </div>
    </div>
  );
}
