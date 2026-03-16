import React, { useState, useEffect } from 'react';
import { Zap, Moon, Sun, Library as LibraryIcon, BookOpen, GraduationCap, Cloud, Search } from 'lucide-react';
import Library from './components/Library';
import BulkUpload from './components/BulkUpload';
import Flashcard from './components/Flashcard';
import Results from './components/Results';
import StudySuccess from './components/StudySuccess';
import { useDarkMode } from './hooks/useDarkMode';

const BIN_ID = "69ad2de643b1c97be9c0526f";
const API_KEY = "$2a$10$eM45IyOzwdgwlmUeY7r8ROJ3k68Ik.0GrklXNyOscfyPO5hziELzu";

function App() {
  const [theme, setTheme] = useDarkMode();
  const [view, setView] = useState('library'); 
  const [libraries, setLibraries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mode, setMode] = useState('study');
  const [isSmartLearn, setIsSmartLearn] = useState(false);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const fetchCloudData = async () => {
      try {
        const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
          headers: { "X-Master-Key": API_KEY }
        });
        const data = await res.json();
        if (data.record) setLibraries(data.record);
      } catch (err) {
        console.error("Error al conectar con la nube:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCloudData();
  }, []);

  const saveToCloud = async (newLibs) => {
    setLibraries(newLibs);
    try {
      await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Master-Key': API_KEY },
        body: JSON.stringify(newLibs)
      });
    } catch (err) { console.error("Error nube:", err); }
  };

  const launchQuiz = (selectedMode, smart) => {
    if (!currentQuiz) return;
    const freshLib = libraries.find(l => l.id === currentQuiz.id) || currentQuiz;
    let data = [...freshLib.questions];

    if (selectedMode === 'consult') {
      setQuestions(data);
      setAnswers({}); // No hay respuestas del usuario en modo consulta
      setView('results');
      return;
    }

    setQuestions(data.sort(() => Math.random() - 0.5));
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
          <h1 className="text-2xl font-black tracking-tighter uppercase flex items-center gap-2" style={{color: 'var(--text-main)'}}>
            MasterQuiz <Cloud size={18} className="text-indigo-400" />
          </h1>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 transition-all">
            {theme === 'dark' ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-slate-600" />}
          </button>
          {view !== 'library' && (
            <button onClick={() => setView('library')} className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg transition-all">
              <LibraryIcon size={20} />
            </button>
          )}
        </div>
      </nav>

      <main className="container mx-auto px-6 py-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-indigo-500">
            <Cloud className="animate-bounce mb-4" size={48} />
            <p className="font-black uppercase tracking-widest">Sincronizando...</p>
          </div>
        ) : (
          <>
            {view === 'library' && (
              <Library 
                libraries={libraries} 
                onNew={() => setView('upload')} 
                onDelete={(id) => saveToCloud(libraries.filter(l => l.id !== id))} 
                onSelect={(lib) => { setCurrentQuiz(lib); setView('selection'); }}
                onUpdateLibrary={(lib) => saveToCloud(libraries.map(l => l.id === lib.id ? lib : l))}
              />
            )}

            {view === 'upload' && <BulkUpload onDataReady={(d, f) => {
              const newLib = { id: Date.now(), name: f.replace('.csv', '').toUpperCase(), questions: d, progress: 0 };
              saveToCloud([newLib, ...libraries]);
              setView('library');
            }} onCancel={() => setView('library')} />}

            {view === 'selection' && (
              <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 animate-slide-up">
                <div onClick={() => launchQuiz('study', true)} className="custom-card p-10 rounded-[3rem] cursor-pointer hover:border-indigo-500 transition-all text-center">
                  <BookOpen size={40} className="text-indigo-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-black mb-2">Flashcards</h2>
                  <p className="text-xs opacity-60">Repetición activa.</p>
                </div>
                <div onClick={() => launchQuiz('quiz', false)} className="custom-card p-10 rounded-[3rem] cursor-pointer hover:border-indigo-500 transition-all text-center">
                  <GraduationCap size={40} className="text-indigo-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-black mb-2">Modo Examen</h2>
                  <p className="text-xs opacity-60">Prueba con tiempo.</p>
                </div>
                <div onClick={() => launchQuiz('consult', false)} className="custom-card p-10 rounded-[3rem] cursor-pointer border-2 border-dashed border-indigo-300 hover:border-indigo-600 transition-all text-center bg-indigo-50/30 dark:bg-indigo-900/10">
                  <Search size={40} className="text-indigo-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-black mb-2">Consultar</h2>
                  <p className="text-xs opacity-60">Ver respuestas de la guía.</p>
                </div>
              </div>
            )}

            {view === 'quiz' && (
              <div className="max-w-2xl mx-auto animate-slide-up">
                <Flashcard 
                  data={questions[currentIndex]} 
                  mode={mode} 
                  isLast={currentIndex === questions.length - 1}
                  onStudyResult={(k) => {
                    if (isSmartLearn && !k) setQuestions(prev => [...prev, {...questions[currentIndex]}]);
                    if (k || currentIndex < questions.length - 1) {
                      if (currentIndex < questions.length - 1) setCurrentIndex(prev => prev + 1);
                      else setView('study_success');
                    }
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
          </>
        )}
      </main>
    </div>
  );
}
export default App;
