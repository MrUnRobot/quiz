import React from 'react';
import { CheckCircle2, XCircle, Home, RotateCcw, Search, BookOpen } from 'lucide-react';

export default function Results({ questions, answers, onReset }) {
  const hasUserAnswers = Object.keys(answers).length > 0;
  const score = questions.reduce((acc, q, idx) => acc + (answers[idx] === q.correcta ? 1 : 0), 0);
  const percentage = Math.round((score / questions.length) * 100);

  return (
    <div className="w-full max-w-3xl mx-auto px-2 pb-10 animate-slide-up">
      {/* Resumen de Puntaje (Solo si viene de Examen) */}
      {hasUserAnswers && (
        <div className="custom-card p-8 rounded-[2.5rem] text-center mb-8 border-b-4 border-indigo-500">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 mb-4">
            <span className="text-3xl font-black">{percentage}%</span>
          </div>
          <h2 className="text-2xl font-black mb-1 italic uppercase tracking-tighter">Resultado Final</h2>
          <p className="opacity-60 font-bold">Lograste {score} de {questions.length} aciertos</p>
        </div>
      )}

      {!hasUserAnswers && (
        <div className="mb-8 flex items-center gap-4 p-6 custom-card rounded-[2rem] bg-indigo-600 text-white">
          <Search size={32} />
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight">Modo Consulta</h2>
            <p className="text-xs opacity-80 font-bold">Explorando el solucionario de la guía</p>
          </div>
        </div>
      )}

      {/* Lista de Preguntas */}
      <div className="space-y-8">
        {questions.map((q, idx) => {
          const userAnswer = answers[idx];
          const isCorrect = userAnswer === q.correcta;

          return (
            <div key={idx} className="custom-card p-6 rounded-[2.5rem] border-t-4" 
                 style={{ borderTopColor: !hasUserAnswers ? '#6366f1' : isCorrect ? '#22c55e' : '#ef4444' }}>
              
              {/* ENCABEZADO: Número de pregunta + Texto */}
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex gap-3">
                  {/* Círculo con número de pregunta */}
                  <div className="shrink-0 w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-sm shadow-lg">
                    {idx + 1}
                  </div>
                  <h3 className="font-bold text-lg leading-tight break-words flex-1 mt-1">
                    {q.pregunta}
                  </h3>
                </div>

                {/* IMAGEN DE APOYO (UAM STYLE) */}
                {q.imagen_url && q.imagen_url.trim() !== "" && (
                  <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white p-2 shadow-inner">
                    <img 
                      src={q.imagen_url} 
                      alt={`Gráfica pregunta ${idx + 1}`} 
                      className="w-full h-auto max-h-[400px] object-contain mx-auto transition-transform hover:scale-105"
                      onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                    />
                  </div>
                )}
              </div>

              {/* OPCIONES DE RESPUESTA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {['A', 'B', 'C', 'D'].map((letter) => {
                  const optionText = q['opcion_' + letter.toLowerCase()];
                  const isCurrentOptionCorrect = letter === q.correcta;
                  const isCurrentOptionSelected = letter === userAnswer;

                  let bgClass = "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-60";
                  let textClass = "text-slate-500 dark:text-slate-400";
                  let circleClass = "bg-slate-200 dark:bg-slate-700 text-slate-400";

                  if (isCurrentOptionCorrect) {
                    bgClass = "bg-green-100 dark:bg-green-900/30 border-green-500 ring-2 ring-green-500/20 opacity-100 scale-[1.02] z-10";
                    textClass = "text-green-700 dark:text-green-300 font-black";
                    circleClass = "bg-green-500 text-white shadow-md";
                  } else if (isCurrentOptionSelected && !isCorrect) {
                    bgClass = "bg-red-100 dark:bg-red-900/30 border-red-500 opacity-100";
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

      {/* Botones de acción */}
      <div className="flex flex-col sm:flex-row gap-4 mt-12">
        <button onClick={onReset} className="flex-1 py-5 bg-slate-200 dark:bg-slate-800 rounded-2xl font-black uppercase text-sm flex items-center justify-center gap-2 active:scale-95 transition-all">
          <Home size={18} /> Menú Principal
        </button>
        <button onClick={() => window.location.reload()} className="flex-1 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all">
          <RotateCcw size={18} /> {hasUserAnswers ? 'Reintentar Examen' : 'Volver al Inicio'}
        </button>
      </div>
    </div>
  );
}
