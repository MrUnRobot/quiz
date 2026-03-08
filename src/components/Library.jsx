import React, { useState, useEffect } from 'react';
import { Book, Trash2, Plus, Play, Edit3, Save, X, Trash, CheckCircle } from 'lucide-react';

export default function Library({ libraries, onNew, onDelete, onSelect, onUpdateLibrary }) {
  const [editingLib, setEditingLib] = useState(null);
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  const handleUpdateQuestion = (qIdx, field, value) => {
    const updatedQuestions = [...editingLib.questions];
    updatedQuestions[qIdx] = { ...updatedQuestions[qIdx], [field]: value };
    setEditingLib({ ...editingLib, questions: updatedQuestions });
  };

  const handleAddQuestion = () => {
    const newQ = { pregunta: "Nueva Pregunta", opcion_a: "", opcion_b: "", opcion_c: "", opcion_d: "", correcta: "A" };
    setEditingLib({ ...editingLib, questions: [newQ, ...editingLib.questions] });
  };

  const handleSaveChanges = () => {
    onUpdateLibrary(editingLib);
    setShowSavedMessage(true);
    // El mensaje desaparece solo tras 3 segundos
    setTimeout(() => setShowSavedMessage(false), 3000);
  };

  if (editingLib) {
    return (
      <div className="animate-slide-up max-w-5xl mx-auto pb-20">
        {/* Banner de Confirmación Flotante */}
        {showSavedMessage && (
          <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] bg-green-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce font-black">
            <CheckCircle size={24} /> ¡Guardado Correctamente!
          </div>
        )}

        <div className="flex justify-between items-center mb-8 sticky top-24 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
          <button 
            onClick={() => setEditingLib(null)} 
            className="flex items-center gap-2 text-slate-500 font-bold hover:text-red-500 transition-colors px-4 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            <X size={20} /> Salir del Editor
          </button>
          
          <div className="hidden md:block text-center">
            <span className="text-[10px] font-black opacity-40 uppercase block">Editando Guía</span>
            <h2 className="text-lg font-black uppercase tracking-tight truncate max-w-[300px]">{editingLib.name}</h2>
          </div>

          <button 
            onClick={handleSaveChanges}
            className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none active:scale-95 transition-all"
          >
            <Save size={18} /> GUARDAR
          </button>
        </div>

        <button onClick={handleAddQuestion} className="w-full mb-8 p-6 border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] flex items-center justify-center gap-3 font-black text-slate-400 hover:text-indigo-600 hover:border-indigo-500 transition-all group">
          <Plus size={24} className="group-hover:rotate-90 transition-transform" /> AÑADIR OTRA PREGUNTA
        </button>

        <div className="grid gap-6">
          {editingLib.questions.map((q, idx) => (
            <div key={idx} className="custom-card p-8 rounded-[2.5rem] border-2 border-slate-200 dark:border-slate-800 animate-slide-up">
              <div className="flex justify-between gap-4 mb-6">
                <div className="flex-1">
                  <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1 block">Pregunta #{editingLib.questions.length - idx}</span>
                  <input 
                    className="w-full bg-transparent text-xl font-bold outline-none border-b-2 border-slate-100 dark:border-slate-800 focus:border-indigo-500 transition-colors pb-2"
                    value={q.pregunta}
                    onChange={(e) => handleUpdateQuestion(idx, 'pregunta', e.target.value)}
                  />
                </div>
                <button 
                  onClick={() => setEditingLib({...editingLib, questions: editingLib.questions.filter((_, i) => i !== idx)})} 
                  className="text-slate-300 hover:text-red-500 p-2 self-start transition-colors"
                  title="Borrar pregunta"
                >
                  <Trash size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['a', 'b', 'c', 'd'].map(letter => {
                  const isCorrect = q.correcta.toLowerCase() === letter;
                  return (
                    <div key={letter} className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 'border-slate-100 dark:border-slate-800'}`}>
                      <span className={`font-black uppercase w-8 h-8 rounded-lg flex items-center justify-center ${isCorrect ? 'bg-green-500 text-white shadow-sm' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                        {letter}
                      </span>
                      <input 
                        className="flex-1 bg-transparent outline-none font-medium text-sm"
                        value={q['opcion_' + letter]}
                        onChange={(e) => handleUpdateQuestion(idx, 'opcion_' + letter, e.target.value)}
                        placeholder="Escribe la respuesta..."
                      />
                      <button 
                        onClick={() => handleUpdateQuestion(idx, 'correcta', letter.toUpperCase())}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${isCorrect ? 'bg-green-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200 hover:text-slate-600'}`}
                      >
                        {isCorrect ? 'CORRECTA' : 'MARCAR'}
                      </button>
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

  // Renderizado normal de la biblioteca (si no estamos editando)
  return (
    <div className="animate-slide-up">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-4xl font-black tracking-tight" style={{color: 'var(--text-main)'}}>Mi Biblioteca</h2>
          <p className="opacity-50 font-medium">Gestiona y edita tus materiales</p>
        </div>
        <button onClick={onNew} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-lg transition-all">
          <Plus size={20} /> Nueva Guía
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {libraries.map((lib) => (
          <div key={lib.id} className="custom-card p-8 rounded-[2.5rem] relative group border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all shadow-md">
            <div className="flex justify-between items-start mb-6">
              <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-2xl text-indigo-600"><Book size={28} /></div>
              <div className="flex gap-1">
                <button onClick={() => setEditingLib(JSON.parse(JSON.stringify(lib)))} className="text-slate-400 hover:text-indigo-600 p-2 transition-colors"><Edit3 size={18} /></button>
                <button onClick={() => onDelete(lib.id)} className="text-slate-400 hover:text-red-500 p-2 transition-colors"><Trash2 size={18} /></button>
              </div>
            </div>
            <h3 className="text-xl font-black mb-2 truncate uppercase">{lib.name}</h3>
            <p className="text-sm opacity-50 mb-8">{lib.questions.length} Preguntas</p>
            <button onClick={() => onSelect(lib)} className="w-full bg-slate-900 dark:bg-indigo-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:opacity-90 transition-all">
              <Play size={18} fill="currentColor" /> ESTUDIAR
            </button>
          </div>
        ))}
        {libraries.length === 0 && (
          <div className="col-span-full py-20 text-center border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem]">
            <PlusCircle size={48} className="mx-auto mb-4 text-slate-300" />
            <p className="text-slate-400 font-bold">No hay guías aún. ¡Sube una!</p>
          </div>
        )}
      </div>
    </div>
  );
}
