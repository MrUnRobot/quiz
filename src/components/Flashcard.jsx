import React, { useState, useEffect } from 'react';
import { RefreshCw, Check, X, Hash } from 'lucide-react';

export default function Flashcard({ data, onAnswer, mode = 'quiz', onStudyResult, isLast, currentIndex, totalQuestions }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setIsFlipped(false);
    setIsProcessing(false);
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  }, [data]);

  if (!data) return null;

  // Badge de numeración común
  const QuestionBadge = () => (
    <div className="absolute -top-4 -right-4 bg-indigo-600 text-white px-4 py-2 rounded-2xl shadow-xl font-black text-sm z-50 flex items-center gap-2">
      <Hash size={14} /> {currentIndex + 1} <span className="opacity-50 text-xs">/ {totalQuestions}</span>
    </div>
  );

  if (mode === 'study') {
    return (
      <div className="max-w-xl mx-auto relative">
        <QuestionBadge />
        <div className={`h-[450px] perspective-1000 ${isProcessing ? 'cursor-wait' : 'cursor-pointer'}`} onClick={() => !isProcessing && setIsFlipped(!isFlipped)}>
          <div className={`relative w-full h-full preserve-3d transition-transform duration-500 ${isFlipped ? 'rotate-y-180' : ''}`}>
            {/* Frente */}
            <div className="absolute inset-0 backface-hidden custom-card p-6 rounded-[2.5rem] flex flex-col items-center text-center">
              <span className="text-[10px] font-black text-indigo-500 uppercase mb-4 tracking-widest">Pregunta</span>
              {data.imagen_url && (
                <div className="w-full h-40 mb-4 bg-white rounded-xl overflow-hidden border">
                  <img src={data.imagen_url} className="w-full h-full object-contain" onError={(e) => e.target.style.display='none'} />
                </div>
              )}
              <h3 className="text-xl font-bold leading-tight flex-1 flex items-center">{data.pregunta}</h3>
              <div className="mt-4 flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase"><RefreshCw size={14} /> Revelar</div>
            </div>
            {/* Atrás */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 bg-indigo-600 p-10 rounded-[2.5rem] text-white flex flex-col justify-center items-center text-center shadow-2xl">
              <span className="text-[10px] font-black opacity-60 uppercase mb-4 tracking-widest text-white">Correcta: {data.correcta}</span>
              <p className="text-2xl font-black">{data['opcion_' + data.correcta.toLowerCase()]}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-4 mt-8">
          <button disabled={isProcessing} onClick={() => onStudyResult(false)} className="flex-1 py-4 rounded-xl font-black text-xs uppercase border-2 border-red-500 text-red-500">No la sé</button>
          <button disabled={isProcessing} onClick={() => onStudyResult(true)} className="flex-1 py-4 rounded-xl font-black text-xs uppercase border-2 border-green-500 text-green-500">La sé</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto custom-card p-6 rounded-[2.5rem] relative">
      <QuestionBadge />
      {data.imagen_url && (
        <div className="w-full mb-6 rounded-2xl overflow-hidden border bg-white p-2">
          <img src={data.imagen_url} className="w-full h-auto max-h-60 object-contain mx-auto" />
        </div>
      )}
      <h3 className="text-xl font-bold mb-6 leading-tight">{data.pregunta}</h3>
      <div className="grid gap-3">
        {['A', 'B', 'C', 'D'].map((letter) => (
          <button key={letter} disabled={isProcessing} onClick={() => { setIsProcessing(true); onAnswer(letter); }}
                  className="w-full text-left p-4 rounded-2xl border border-slate-200 dark:border-slate-800 active:bg-indigo-50 transition-all flex items-center gap-4 group">
            <span className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-black text-indigo-600 group-active:bg-indigo-600 group-active:text-white">{letter}</span>
            <span className="flex-1 text-sm font-medium">{data['opcion_' + letter.toLowerCase()]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
