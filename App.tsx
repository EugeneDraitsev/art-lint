import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { UploadZone } from './components/UploadZone';
import { ComparisonView } from './components/ComparisonView';
import { LessonCard } from './components/LessonCard';
import { LessonDetail } from './components/LessonDetail';
import { AppState, AnalysisResult, Lesson } from './types';
import { LESSONS } from './constants';
import { fileToGenerativePart, analyzeDrawingText, generateFixedVersion, generateOverlay, generateStructureGuide } from './services/geminiService';
import { ArrowRight, Star, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function App() {
  const [appState, setAppState] = useState<AppState>(AppState.HOME);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to scroll to top on state change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [appState]);

  const handleLessonSelect = (lesson: Lesson) => {
      setSelectedLesson(lesson);
      setAppState(AppState.LESSON_DETAIL);
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

      setAnalysisResult({
        originalImage: base64Data,
        overlayImage: overlayImageBase64,
        structureImage: structureImageBase64,
        fixedImage: fixedImageBase64,
        textCritique: textResult.critique,
        points: textResult.points,
        suggestedExercises: textResult.exercises
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
                <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-6 tracking-tight">
                  Level Up Your Art <br /> with AI Feedback
                </h1>
                <p className="mt-4 text-xl text-gray-400 max-w-2xl mx-auto mb-10">
                  Upload your sketches. Get instant, professional-grade critiques on perspective, anatomy, and style from our Gemini-powered tutor.
                </p>
                <div className="flex justify-center gap-4">
                    <button 
                        onClick={() => {
                            setSelectedLesson(null); // Clear context for generic analysis
                            setAppState(AppState.ANALYZING);
                        }}
                        className="px-8 py-4 bg-white text-gray-900 rounded-full font-bold text-lg hover:bg-gray-100 transition shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                    >
                        Analyze My Drawing
                    </button>
                     <button 
                        onClick={() => setAppState(AppState.LESSONS)}
                        className="px-8 py-4 bg-gray-800 text-white border border-gray-700 rounded-full font-bold text-lg hover:bg-gray-700 transition"
                    >
                        Browse Lessons
                    </button>
                </div>
              </div>
              
              {/* Decorative BG elements */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 opacity-20 pointer-events-none">
                 <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-600 rounded-full blur-[100px]"></div>
                 <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600 rounded-full blur-[120px]"></div>
              </div>
            </section>

            {/* Features Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 backdrop-blur">
                        <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-6">
                            <Star className="text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Instant Critique</h3>
                        <p className="text-gray-400">Get detailed text feedback on your technique instantly. No more waiting for forum replies.</p>
                    </div>
                     <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 backdrop-blur">
                        <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mb-6">
                            <ArrowRight className="text-pink-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Visual Corrections</h3>
                        <p className="text-gray-400">See exactly how to fix your mistakes. We generate a corrected overlay of your specific drawing.</p>
                    </div>
                     <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 backdrop-blur">
                        <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-6">
                            <AlertTriangle className="text-green-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Personalized Drills</h3>
                        <p className="text-gray-400">Receive custom exercises based on your specific weaknesses to practice effectively.</p>
                    </div>
                </div>
            </section>

            {/* Featured Lessons Preview */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-8">
                    <h2 className="text-3xl font-bold text-white">Popular Lessons</h2>
                    <button 
                        onClick={() => setAppState(AppState.LESSONS)}
                        className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center"
                    >
                        View all <ArrowRight className="ml-1 w-4 h-4" />
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {LESSONS.slice(0, 3).map(lesson => (
                        <LessonCard 
                            key={lesson.id} 
                            lesson={lesson} 
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
            <h1 className="text-4xl font-bold text-white mb-4">Drawing Lessons</h1>
            <p className="text-gray-400 mb-12 max-w-2xl">Browse our library of tutorials designed to tackle common drawing challenges, from basic perspective to advanced figure drawing.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {LESSONS.map(lesson => (
                <LessonCard 
                    key={lesson.id} 
                    lesson={lesson} 
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
                onBack={() => setAppState(AppState.LESSONS)} 
                onUpload={(file) => handleFileSelect(file, `${selectedLesson.title} - ${selectedLesson.description}`)}
                isProcessing={isProcessing}
            />
        ) : null;

      case AppState.ANALYZING:
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center min-h-[60vh]">
            <h2 className="text-3xl font-bold text-white mb-4">Let's check your work</h2>
            {selectedLesson && (
                 <p className="text-indigo-300 text-lg mb-4 bg-indigo-500/10 px-4 py-2 rounded-full">
                    Analysing assignment for: {selectedLesson.title}
                 </p>
            )}
            {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200 max-w-lg text-center">
                    {error}
                </div>
            )}
            {/* If we are analyzing, the processing state comes from isProcessing. 
                We pass generic handler here, but typically we enter this state via state change */}
            <UploadZone onFileSelect={(f) => handleFileSelect(f)} isProcessing={isProcessing} />
          </div>
        );

      case AppState.RESULTS:
        return analysisResult ? (
          <div className="py-12 px-4 sm:px-6 lg:px-8">
             <div className="max-w-7xl mx-auto mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                     {selectedLesson && (
                        <button 
                            onClick={() => setAppState(AppState.LESSON_DETAIL)}
                            className="text-indigo-400 hover:text-white flex items-center text-sm font-medium mb-2 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1"/> Back to Lesson
                        </button>
                    )}
                    <h1 className="text-3xl font-bold text-white">Analysis Results</h1>
                </div>
                <button 
                    onClick={() => {
                        setSelectedLesson(null);
                        setAppState(AppState.ANALYZING);
                    }} 
                    className="text-sm text-gray-400 hover:text-white border border-gray-700 px-4 py-2 rounded-lg"
                >
                    Upload Another
                </button>
             </div>
            <ComparisonView result={analysisResult} />
          </div>
        ) : null;
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white selection:bg-indigo-500 selection:text-white">
      <Header currentState={appState} setAppState={(state) => {
          // Clear lesson context if navigating to generic sections via header
          if(state === AppState.HOME || state === AppState.LESSONS) {
             setSelectedLesson(null); 
          }
          setAppState(state);
      }} />
      <main>
        {renderContent()}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-gray-800 mt-20 py-12 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
            <p>© 2024 ArtLint. Powered by Google Gemini.</p>
        </div>
      </footer>
    </div>
  );
}