import React, { useState, useEffect } from 'react';
import { Zap, Moon, Sun, Library as LibraryIcon, PlusCircle, BookOpen, GraduationCap } from 'lucide-react';
import Library from './components/Library';
import BulkUpload from './components/BulkUpload';
import Flashcard from './components/Flashcard';
import Results from './components/Results';
import StudySuccess from './components/StudySuccess';
import { useDarkMode } from './hooks/useDarkMode';

function App() {
  const [theme, setTheme] = useDarkMode();
  const [view, setView] = useState('library'); 
  const [libraries, setLibraries] = useState(() => {
    const saved = localStorage.getItem('masterquiz_library');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mode, setMode] = useState('study');
  const [isSmartLearn, setIsSmartLearn] = useState(false);
  const [answers, setAnswers] = useState({});

  const saveToLocalStorage = (newLibs) => {
    setLibraries(newLibs);
    localStorage.setItem('masterquiz_library', JSON.stringify(newLibs));
  };

  const handleUpdateLibrary = (updatedLib) => {
    const newLibs = libraries.map(lib => lib.id === updatedLib.id ? updatedLib : lib);
    saveToLocalStorage(newLibs);
  };

  const handleFileUpload = (data, fileName) => {
    const newLib = {
      id: Date.now(),
      name: fileName.replace('.csv', '').toUpperCase(),
      questions: data,
      progress: 0
    };
    const updatedLibs = [newLib, ...libraries];
    saveToLocalStorage(updatedLibs);
    setView('library');
  };

  const launchQuiz = (selectedMode, smart) => {
    if (!currentQuiz) return;
    // Buscamos la versión más reciente de la librería por si fue editada
    const freshLib = libraries.find(l => l.id === currentQuiz.id) || currentQuiz;
    let data = [...freshLib.questions].sort(() => Math.random() - 0.5);
    setQuestions(data);
    setMode(selectedMode);
    setIsSmartLearn(smart);
    setCurrentIndex(0);
    setAnswers({});
    setView('quiz');
  };

  return (
    <div className="min-h-screen transition-colors duration-300">
      <nav className="py-4 px-8 flex justify-between items-center sticky top-0 z-50 backdrop-blur-md border-b border-slate-200 dark:border-slate-800" style={{backgroundColor: 'var(--bg-app)'}}>
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setView('library')}>
          <Zap className="text-indigo-600 fill-indigo-600 group-hover:scale-110 transition-transform" size={28} />
          <h1 className="text-2xl font-black tracking-tighter uppercase" style={{color: 'var(--text-main)'}}>MasterQuiz</h1>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 transition-all">
            {theme === 'dark' ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-slate-600" />}
          </button>
          {view !== 'library' && (
            <button onClick={() => setView('library')} className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg transition-all active:scale-95">
              <LibraryIcon size={20} />
            </button>
          )}
        </div>
      </nav>

      <main className="container mx-auto px-6 py-10">
        {view === 'library' && (
          <Library 
            libraries={libraries} 
            onNew={() => setView('upload')} 
            onDelete={(id) => saveToLocalStorage(libraries.filter(l => l.id !== id))} 
            onSelect={(lib) => { setCurrentQuiz(lib); setView('selection'); }}
            onUpdateLibrary={handleUpdateLibrary}
          />
        )}

        {view === 'upload' && <BulkUpload onDataReady={handleFileUpload} onCancel={() => setView('library')} />}

        {view === 'selection' && (
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 animate-slide-up">
            <div onClick={() => launchQuiz('study', true)} className="custom-card p-12 rounded-[3rem] cursor-pointer hover:border-indigo-500 transition-all">
              <BookOpen size={48} className="text-indigo-600 mb-6" />
              <h2 className="text-3xl font-black mb-3">Flashcards</h2>
              <p className="opacity-60 font-medium">Memorización con repetición.</p>
            </div>
            <div onClick={() => launchQuiz('quiz', false)} className="custom-card p-12 rounded-[3rem] cursor-pointer hover:border-indigo-500 transition-all">
              <GraduationCap size={48} className="text-indigo-600 mb-6" />
              <h2 className="text-3xl font-black mb-3">Modo Examen</h2>
              <p className="opacity-60 font-medium">Ponte a prueba con tiempo.</p>
            </div>
          </div>
        )}

        {view === 'quiz' && questions[currentIndex] && (
          <div className="max-w-2xl mx-auto animate-slide-up">
            <div className="flex justify-between items-center mb-8 custom-card p-6 rounded-3xl">
              <div>
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Pregunta</p>
                <p className="text-2xl font-black">{currentIndex + 1} / {questions.length}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">Guía</p>
                <p className="text-sm font-bold">{currentQuiz?.name}</p>
              </div>
            </div>
            <Flashcard 
              data={questions[currentIndex]} 
              mode={mode} 
              onStudyResult={(k) => {
                if (isSmartLearn && !k) setQuestions(prev => [...prev, {...questions[currentIndex]}]);
                if (currentIndex < questions.length - 1) setCurrentIndex(prev => prev + 1);
                else setView('study_success');
              }}
              onAnswer={(a) => {
                setAnswers(prev => ({...prev, [currentIndex]: a}));
                if (currentIndex < questions.length - 1) setCurrentIndex(prev => prev + 1);
                else setView('results');
              }} 
            />
          </div>
        )}
        
        {view === 'study_success' && <StudySuccess onRepeat={() => launchQuiz('study', true)} onHome={() => setView('library')} />}
        {view === 'results' && <Results questions={questions} answers={answers} onReset={() => setView('library')} />}
      </main>
    </div>
  );
}
export default App;
