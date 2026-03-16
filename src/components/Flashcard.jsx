import React, { useState, useEffect } from 'react';
import { RefreshCw, Check, X, Hash } from 'lucide-react';

export default function Flashcard({ data, onAnswer, mode = 'quiz', onStudyResult, isLast, currentIndex, totalQuestions }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // EFECTO DE RESET: Cada vez que 'data' cambia, forzamos que la tarjeta se voltee al frente
  useEffect(() => {
    setIsFlipped(false);
    setIsProcessing(false);
    
    // Quitamos el foco de cualquier botón para evitar el error de "iluminado" en móviles
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, [data]);

  const handleAction = (callback, value) => {
    if (isProcessing) return;
    setIsProcessing(true);
    
    // Primero volteamos la tarjeta al frente para que el usuario no vea la respuesta de la siguiente
    setIsFlipped(false);
    
    // Esperamos a que termine la animación de volteo antes de pasar a la siguiente pregunta
    setTimeout(() => {
      callback(value);
    }, 300);
  };

  if (!data) return null;

  const QuestionBadge = () => (
    <div className="absolute -top-4 -right-2 sm:-right-4 bg-indigo-600 text-white px-4 py-2 rounded-2xl shadow-xl font-black text-sm z-50 flex items-center gap-2 border-2 border-white dark:border-slate-900">
      <Hash size={14} className="text-indigo-300" /> 
      <span>{currentIndex + 1}</span>
      <span className="opacity-40 text-[10px]">/</span>
      <span className="opacity-60 text-xs">{totalQuestions}</span>
    </div>
  );

  if (mode === 'study') {
    return (
      <div className="max-w-xl mx-auto relative px-2">
        <QuestionBadge />
        <div 
          className={`h-[450px] perspective-1000 ${isProcessing ? 'cursor-wait' : 'cursor-pointer'}`} 
          onClick={() => !isProcessing && setIsFlipped(!isFlipped)}
        >
          <div className={`relative w-full h-full transition-transform duration-500 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
            
            {/* FRENTE: Pregunta */}
            <div className="absolute inset-0 backface-hidden custom-card p-6 rounded-[2.5rem] flex flex-col items-center text-center shadow-xl border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-black text-indigo-500 uppercase mb-4 tracking-widest">Pregunta</span>
              
              {data.imagen_url && (
                <div className="w-full h-44 mb-4 bg-white rounded-2xl overflow-hidden border border-slate-100 p-2">
                  <img src={data.imagen_url} className="w-full h-full object-contain" alt="Visual" />
                </div>
              )}
              
              <h3 className="text-xl font-bold leading-tight flex-1 flex items-center px-4 italic">
                "{data.pregunta}"
              </h3>
              
              <div className="mt-4 flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase">
                <RefreshCw size={14} className="animate-spin-slow" /> Tocar para revelar respuesta
              </div>
            </div>

            {/* ATRÁS: Respuesta */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 bg-indigo-600 p-8 rounded-[2.5rem] text-white flex flex-col justify-center items-center text-center shadow-2xl">
              <span className="text-[10px] font-black opacity-60 uppercase mb-6 tracking-widest">Respuesta Correcta</span>
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-4 text-4xl font-black">
                {data.correcta}
              </div>
              <p className="text-2xl font-black leading-tight">
                {data['opcion_' + data.correcta.toLowerCase()]}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button 
            disabled={isProcessing} 
            onClick={() => handleAction(onStudyResult, false)} 
            className="flex-1 py-5 rounded-2xl font-black text-xs uppercase border-2 border-red-500 text-red-500 active:bg-red-500 active:text-white transition-all shadow-lg shadow-red-100 dark:shadow-none"
          >
            <X size={18} className="inline mr-1" /> No la sé
          </button>
          
          <button 
            disabled={isProcessing} 
            onClick={() => handleAction(onStudyResult, true)} 
            className="flex-1 py-5 rounded-2xl font-black text-xs uppercase border-2 border-green-500 text-green-500 active:bg-green-500 active:text-white transition-all shadow-lg shadow-green-100 dark:shadow-none"
          >
            <Check size={18} className="inline mr-1" /> La sé
          </button>
        </div>
      </div>
    );
  }

  // MODO QUIZ (Examen)
  return (
    <div className="max-w-xl mx-auto custom-card p-6 rounded-[2.5rem] relative shadow-2xl border border-slate-100 dark:border-slate-800">
      <QuestionBadge />
      
      {data.imagen_url && (
        <div className="w-full mb-6 rounded-2xl overflow-hidden border border-slate-100 bg-white p-4 shadow-inner">
          <img src={data.imagen_url} className="w-full h-auto max-h-60 object-contain mx-auto" alt="Examen" />
        </div>
      )}

      <h3 className="text-xl font-bold mb-8 leading-tight px-2">{data.pregunta}</h3>
      
      <div className="grid gap-3">
        {['A', 'B', 'C', 'D'].map((letter) => (
          <button 
            key={letter} 
            disabled={isProcessing} 
            onClick={() => handleAction(onAnswer, letter)}
            className="w-full text-left p-5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 hover:border-indigo-500 active:bg-indigo-600 active:text-white transition-all flex items-center gap-4 group outline-none shadow-sm"
          >
            <span className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-black text-indigo-600 group-active:bg-indigo-400 group-active:text-white transition-colors">
              {letter}
            </span>
            <span className="flex-1 text-sm font-bold opacity-80">{data['opcion_' + letter.toLowerCase()]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
