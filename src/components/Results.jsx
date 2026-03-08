import React from 'react';
import { Trophy, RefreshCcw, CheckCircle2, XCircle, Award } from 'lucide-react';

export default function Results({ questions, answers, onReset }) {
  const score = questions.reduce((acc, q, idx) => acc + (answers[idx] === q.correcta ? 1 : 0), 0);
  const percentage = Math.round((score / questions.length) * 100);

  return (
    <div className="max-w-6xl mx-auto animate-slide-up pb-20 px-4">
      {/* Cabecera de Resultados */}
      <div className="custom-card p-10 rounded-[3rem] text-center mb-12 max-w-2xl mx-auto border-b-8 border-indigo-600/20">
        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg rotate-3">
          <Award size={32} className="text-white" />
        </div>
        <h2 className="text-4xl font-black mb-10">Resultados del Examen</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-6 rounded-[2rem] bg-white/60 dark:bg-slate-800/50 border border-white/50 dark:border-slate-700">
            <p className="text-4xl font-black text-indigo-600">{percentage}%</p>
            <p className="text-[10px] font-black opacity-50 uppercase tracking-widest mt-2">Puntaje</p>
          </div>
          <div className="p-6 rounded-[2rem] bg-white/60 dark:bg-slate-800/50 border border-white/50 dark:border-slate-700">
            <p className="text-4xl font-black text-indigo-600">{score}/{questions.length}</p>
            <p className="text-[10px] font-black opacity-50 uppercase tracking-widest mt-2">Aciertos</p>
          </div>
        </div>

        <button 
          onClick={onReset} 
          className="w-full bg-slate-900 dark:bg-indigo-600 text-white py-5 rounded-2xl font-black text-xl hover:scale-[1.02] transition-all shadow-xl"
        >
          <RefreshCcw size={24} className="inline mr-2" /> REINTENTAR GUÍA
        </button>
      </div>

      <h3 className="text-2xl font-black mb-8 border-l-8 border-indigo-600 pl-6 ml-2">Revisión por Pregunta</h3>

      {/* Grid de 2 columnas: Dos preguntas por fila */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {questions.map((q, idx) => (
          <div key={idx} className="custom-card p-8 rounded-[2.5rem] flex flex-col shadow-md">
            <div className="flex gap-4 mb-6">
              {answers[idx] === q.correcta ? (
                <div className="bg-green-100 text-green-600 p-2 rounded-xl h-fit shadow-sm"><CheckCircle2 size={24} /></div>
              ) : (
                <div className="bg-red-100 text-red-600 p-2 rounded-xl h-fit shadow-sm"><XCircle size={24} /></div>
              )}
              <h4 className="font-black leading-tight text-base md:text-lg pt-1">{q.pregunta}</h4>
            </div>

            <div className="grid gap-3 mt-auto">
              {['A', 'B', 'C', 'D'].map((letter) => {
                const isUserChoice = answers[idx] === letter;
                const isCorrect = q.correcta === letter;

                // Cápsulas de respuesta con fondo blanco/crema sobre la tarjeta gris
                let capClasses = "bg-white/80 dark:bg-slate-800/40 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300";
                
                if (isCorrect) capClasses = "bg-green-600 text-white border-green-700 font-black shadow-md scale-[1.03] z-10";
                else if (isUserChoice) capClasses = "bg-red-500 text-white border-red-700 font-black shadow-md";

                return (
                  <div key={letter} className={`p-4 rounded-xl border-2 flex items-center gap-4 text-sm transition-all ${capClasses}`}>
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-black ${isCorrect || isUserChoice ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                      {letter}
                    </span>
                    <span className="font-bold truncate text-xs md:text-sm">{q['opcion_' + letter.toLowerCase()]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
