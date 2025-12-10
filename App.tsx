import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { UploadZone } from './components/UploadZone';
import { ComparisonView } from './components/ComparisonView';
import { LessonCard } from './components/LessonCard';
import { LessonDetail } from './components/LessonDetail';
import { About } from './components/About';
import { AppState, AnalysisResult, Lesson, SubmissionRecord } from './types';
import { LESSONS } from './constants';
import { fileToGenerativePart, analyzeDrawingText, generateFixedVersion, generateOverlay, generateStructureGuide, generateLessonPlan } from './services/geminiService';
import { ArrowRight, Star, AlertTriangle, ArrowLeft, PenTool } from 'lucide-react';

export default function App() {
  const [appState, setAppState] = useState<AppState>(AppState.HOME);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingLesson, setIsGeneratingLesson] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<SubmissionRecord[]>([]);

  // Load history from local storage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('artlint_history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error("Failed to load history", e);
    }
  }, []);

  // Helper to scroll to top on state change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [appState]);

  // Save score to history if this is a lesson submission
  const saveSubmission = (lessonId: string, score: number) => {
    const newRecord: SubmissionRecord = {
      lessonId,
      score,
      timestamp: Date.now()
    };
    const updatedHistory = [...history, newRecord];
    setHistory(updatedHistory);
    localStorage.setItem('artlint_history', JSON.stringify(updatedHistory));
  };

  const getBestScore = (lessonId: string): number | undefined => {
    const scores = history.filter(h => h.lessonId === lessonId).map(h => h.score);
    if (scores.length === 0) return undefined;
    return Math.max(...scores);
  };

  const handleLessonSelect = (lesson: Lesson) => {
      setSelectedLesson(lesson);
      setAppState(AppState.LESSON_DETAIL);
  };

  const handleGenerateCustomLesson = async () => {
      if (!analysisResult) return;
      
      try {
          setIsGeneratingLesson(true);
          // Pass the critique points to generate a lesson
          const customLesson = await generateLessonPlan(analysisResult.points);
          
          setSelectedLesson(customLesson);
          setAppState(AppState.LESSON_DETAIL);
      } catch (e) {
          console.error(e);
          alert("Failed to generate custom lesson. Please try again.");
      } finally {
          setIsGeneratingLesson(false);
      }
  };

  const handleFileSelect = async (file: File, lessonContext?: string) => {
    try {
      setError(null);
      setIsProcessing(true);
      setAppState(AppState.ANALYZING);

      // 1. Convert File to Base64
      const base64Data = await fileToGenerativePart(file);

      // 2. Parallel API Calls: Text, Overlay, Structure, and Fixed Version
      // Initiate all requests in parallel for speed
      // Pass the lessonContext if available to make the AI smarter about the specific task
      const textPromise = analyzeDrawingText(base64Data, file.type, lessonContext);
      const overlayPromise = generateOverlay(base64Data, file.type, lessonContext);
      const structurePromise = generateStructureGuide(base64Data, file.type, lessonContext);
      const fixedPromise = generateFixedVersion(base64Data, file.type, lessonContext);

      const [textResult, overlayImageBase64, structureImageBase64, fixedImageBase64] = await Promise.all([
        textPromise, 
        overlayPromise, 
        structurePromise,
        fixedPromise
      ]);

      // Save submission if it's for a specific lesson
      if (selectedLesson) {
        saveSubmission(selectedLesson.id, textResult.score);
      }

      setAnalysisResult({
        originalImage: base64Data,
        overlayImage: overlayImageBase64,
        structureImage: structureImageBase64,
        fixedImage: fixedImageBase64,
        textCritique: textResult.critique,
        points: textResult.points,
        suggestedExercises: textResult.exercises,
        score: textResult.score
      });

      setAppState(AppState.RESULTS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong during analysis. Please try again.");
      setAppState(AppState.HOME); // Or stay on upload but show error
    } finally {
      setIsProcessing(false);
    }
  };

  const renderContent = () => {
    switch (appState) {
      case AppState.HOME:
        return (
          <div className="space-y-16 pb-20">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-20 pb-24 px-4 sm:px-6 lg:px-8 text-center">
              <div className="max-w-4xl mx-auto relative z-10">
                <div className="inline-flex items-center justify-center p-2 bg-stone-800/50 backdrop-blur rounded-full mb-6 border border-stone-700">
                    <PenTool className="w-4 h-4 text-sky-400 mr-2" />
                    <span className="text-stone-300 text-sm font-medium">Your Personal AI Art Tutor</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold text-stone-100 mb-6 tracking-tight font-serif leading-tight">
                  Master the Art of <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-indigo-300">Drawing & Form</span>
                </h1>
                <p className="mt-4 text-xl text-stone-400 max-w-2xl mx-auto mb-10 font-light">
                  Upload your sketches. Get instant, professional-grade critiques on perspective, anatomy, and lighting from our Gemini-powered tutor.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button 
                        onClick={() => {
                            setSelectedLesson(null); // Clear context for generic analysis
                            setAppState(AppState.ANALYZING);
                        }}
                        className="px-8 py-4 bg-stone-100 text-stone-900 rounded-lg font-bold text-lg hover:bg-white transition shadow-xl hover:shadow-2xl hover:-translate-y-1 duration-300"
                    >
                        Analyze My Drawing
                    </button>
                     <button 
                        onClick={() => setAppState(AppState.LESSONS)}
                        className="px-8 py-4 bg-stone-800 text-stone-200 border border-stone-700 rounded-lg font-bold text-lg hover:bg-stone-700 transition hover:-translate-y-1 duration-300"
                    >
                        Browse Lessons
                    </button>
                </div>
              </div>
              
              {/* Decorative BG elements - More subtle for 'Studio' vibe */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 opacity-10 pointer-events-none">
                 <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-sky-900/40 rounded-full blur-[120px]"></div>
                 <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-900/30 rounded-full blur-[120px]"></div>
              </div>
            </section>

            {/* Features Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-stone-900 p-8 rounded-xl border border-stone-800 shadow-lg hover:border-stone-700 transition-colors">
                        <div className="w-12 h-12 bg-stone-800 rounded-lg flex items-center justify-center mb-6 border border-stone-700">
                            <Star className="text-sky-400" />
                        </div>
                        <h3 className="text-xl font-bold text-stone-100 mb-3 font-serif">Instant Critique</h3>
                        <p className="text-stone-400 leading-relaxed">Get detailed text feedback on your technique instantly. No more waiting for forum replies.</p>
                    </div>
                     <div className="bg-stone-900 p-8 rounded-xl border border-stone-800 shadow-lg hover:border-stone-700 transition-colors">
                        <div className="w-12 h-12 bg-stone-800 rounded-lg flex items-center justify-center mb-6 border border-stone-700">
                            <ArrowRight className="text-pink-400" />
                        </div>
                        <h3 className="text-xl font-bold text-stone-100 mb-3 font-serif">Visual Corrections</h3>
                        <p className="text-stone-400 leading-relaxed">See exactly how to fix your mistakes. We generate a corrected overlay of your specific drawing.</p>
                    </div>
                     <div className="bg-stone-900 p-8 rounded-xl border border-stone-800 shadow-lg hover:border-stone-700 transition-colors">
                        <div className="w-12 h-12 bg-stone-800 rounded-lg flex items-center justify-center mb-6 border border-stone-700">
                            <AlertTriangle className="text-emerald-400" />
                        </div>
                        <h3 className="text-xl font-bold text-stone-100 mb-3 font-serif">Personalized Drills</h3>
                        <p className="text-stone-400 leading-relaxed">Receive custom exercises based on your specific weaknesses to practice effectively.</p>
                    </div>
                </div>
            </section>

            {/* Featured Lessons Preview */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-8 border-b border-stone-800 pb-4">
                    <h2 className="text-3xl font-bold text-stone-100 font-serif">Popular Lessons</h2>
                    <button 
                        onClick={() => setAppState(AppState.LESSONS)}
                        className="text-sky-400 hover:text-sky-300 font-medium flex items-center transition-colors"
                    >
                        View all <ArrowRight className="ml-1 w-4 h-4" />
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {LESSONS.slice(0, 3).map(lesson => (
                        <LessonCard 
                            key={lesson.id} 
                            lesson={lesson} 
                            bestScore={getBestScore(lesson.id)}
                            onClick={() => handleLessonSelect(lesson)}
                        />
                    ))}
                </div>
            </section>
          </div>
        );

      case AppState.LESSONS:
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold text-stone-100 mb-4 font-serif">Drawing Lessons</h1>
            <p className="text-stone-400 mb-12 max-w-2xl text-lg font-light">Browse our library of tutorials designed to tackle common drawing challenges, from basic perspective to advanced figure drawing.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {LESSONS.map(lesson => (
                <LessonCard 
                    key={lesson.id} 
                    lesson={lesson} 
                    bestScore={getBestScore(lesson.id)}
                    onClick={() => handleLessonSelect(lesson)}
                />
              ))}
            </div>
          </div>
        );
      
      case AppState.LESSON_DETAIL:
        return selectedLesson ? (
            <LessonDetail 
                lesson={selectedLesson} 
                bestScore={getBestScore(selectedLesson.id)}
                onBack={() => setAppState(AppState.LESSONS)} 
                onUpload={(file) => handleFileSelect(file, `${selectedLesson.title} - ${selectedLesson.description}`)}
                isProcessing={isProcessing}
            />
        ) : null;

      case AppState.ANALYZING:
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center min-h-[60vh]">
            <h2 className="text-4xl font-bold text-stone-100 mb-4 font-serif">Let's Check Your Work</h2>
            {selectedLesson && (
                 <p className="text-sky-300 text-lg mb-6 bg-sky-900/20 border border-sky-800/50 px-4 py-2 rounded-full font-medium">
                    Analysing assignment for: {selectedLesson.title}
                 </p>
            )}
            {error && (
                <div className="mb-6 p-4 bg-red-900/20 border border-red-800/50 rounded-lg text-red-200 max-w-lg text-center">
                    {error}
                </div>
            )}
            <UploadZone onFileSelect={(f) => handleFileSelect(f)} isProcessing={isProcessing} />
          </div>
        );

      case AppState.RESULTS:
        return analysisResult ? (
          <div className="py-12 px-4 sm:px-6 lg:px-8">
             <div className="max-w-7xl mx-auto mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-800 pb-6">
                <div>
                     {selectedLesson && (
                        <button 
                            onClick={() => setAppState(AppState.LESSON_DETAIL)}
                            className="text-stone-400 hover:text-white flex items-center text-sm font-medium mb-2 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1"/> Back to Lesson
                        </button>
                    )}
                    <h1 className="text-3xl font-bold text-stone-100 font-serif">Critique Results</h1>
                </div>
                <div className="flex gap-2">
                     <button 
                        onClick={() => {
                            setSelectedLesson(null);
                            setAppState(AppState.ANALYZING);
                        }} 
                        className="text-sm font-semibold text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 border border-stone-700 px-5 py-2.5 rounded-lg transition-colors"
                    >
                        Upload Another
                    </button>
                </div>
             </div>
            <ComparisonView 
                result={analysisResult} 
                onGenerateLesson={handleGenerateCustomLesson}
                isGeneratingLesson={isGeneratingLesson}
            />
          </div>
        ) : null;
        
      case AppState.ABOUT:
        return <About />;
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 selection:bg-sky-500/30 selection:text-sky-100">
      <Header currentState={appState} setAppState={(state) => {
          if(state === AppState.HOME || state === AppState.LESSONS) {
             setSelectedLesson(null); 
          }
          setAppState(state);
      }} />
      <main>
        {renderContent()}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-stone-900 mt-20 py-12 bg-stone-950">
        <div className="max-w-7xl mx-auto px-4 text-center text-stone-600">
            <p>© 2024 ArtLint. Powered by Google Gemini.</p>
        </div>
      </footer>
    </div>
  );
}