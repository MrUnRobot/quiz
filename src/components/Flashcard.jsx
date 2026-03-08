import React, { useState, useEffect } from 'react';
import { RefreshCw, Check, X } from 'lucide-react';

export default function Flashcard({ data, onAnswer, mode = 'quiz', onStudyResult, isLast }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [clickedBtn, setClickedBtn] = useState(null);

  useEffect(() => {
    setIsFlipped(false);
    setClickedBtn(null);
    setIsProcessing(false);
  }, [data]);

  const handleStudyAction = (known) => {
    if (isProcessing) return;

    // CASO A: Se la sabe (Avanza siempre)
    // CASO B: No se la sabe pero NO es la última (Avanza para seguir el flujo)
    if (known || (!known && !isLast)) {
      setIsProcessing(true);
      setClickedBtn(known ? 'yes' : 'no');
      setIsFlipped(false);
      setTimeout(() => onStudyResult(known), 350);
    } 
    // CASO C: No se la sabe y ES la última (Bloqueo para aprendizaje)
    else {
      setIsProcessing(true);
      setIsFlipped(false); // Volteamos la tarjeta al frente para repetir
      setTimeout(() => {
        setIsProcessing(false);
        setClickedBtn(null);
      }, 400);
    }
  };

  if (!data) return null;

  if (mode === 'study') {
    return (
      <div className="max-w-xl mx-auto">
        <div 
          className={`h-80 perspective-1000 ${isProcessing ? 'cursor-wait' : 'cursor-pointer'}`}
          onClick={() => !isProcessing && setIsFlipped(!isFlipped)}
        >
          <div className={`relative w-full h-full preserve-3d fast-flip ${isFlipped ? 'rotate-y-180' : ''}`}>
            
            {/* Frontal: Pregunta */}
            <div className="absolute inset-0 backface-hidden custom-card p-10 rounded-[2.5rem] flex flex-col justify-center items-center text-center">
              <span className="text-[10px] font-black text-indigo-500 uppercase mb-4 tracking-widest">Pregunta</span>
              <h3 className="text-2xl font-bold leading-tight">{data.pregunta}</h3>
              <div className="mt-8 flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase">
                <RefreshCw size={14} /> Tocar para revelar
              </div>
            </div>

            {/* Trasera: Respuesta */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 bg-indigo-600 p-10 rounded-[2.5rem] text-white flex flex-col justify-center items-center text-center shadow-2xl">
              <span className="text-[10px] font-black opacity-60 uppercase mb-4 tracking-widest">Respuesta</span>
              <p className="text-3xl font-black">{data['opcion_' + (data.correcta?.toLowerCase() || 'a')]}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-6 mt-10">
          <button 
            disabled={isProcessing} 
            onClick={() => handleStudyAction(false)} 
            className="flex-1 py-5 rounded-2xl font-black text-sm uppercase border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-95"
          >
            <X size={20} className="inline mr-2" /> No la sé
          </button>
          <button 
            disabled={isProcessing} 
            onClick={() => handleStudyAction(true)} 
            className="flex-1 py-5 rounded-2xl font-black text-sm uppercase border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-all active:scale-95"
          >
            <Check size={20} className="inline mr-2" /> La sé
          </button>
        </div>
      </div>
    );
  }

  // Renderizado Modo QUIZ (Examen)
  return (
    <div className="max-w-xl mx-auto custom-card p-8 rounded-[2.5rem]">
      <h3 className="text-2xl font-bold mb-8 leading-snug">{data.pregunta}</h3>
      <div className="grid gap-3">
        {['A', 'B', 'C', 'D'].map((letter) => (
          <button 
            key={letter} 
            disabled={isProcessing}
            onClick={() => { setIsProcessing(true); onAnswer(letter); }}
            className="w-full text-left p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all flex items-center gap-4 group"
          >
            <span className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-black text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              {letter}
            </span>
            <span className="flex-1 font-medium">{data['opcion_' + letter.toLowerCase()]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
