import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Lesson } from '../types';
import { ArrowLeft, Clock, BarChart, CheckCircle, Upload, Trophy, Box } from 'lucide-react';
import { 
  renderDiagram,
  SphereStep1,
  SphereStep2,
  SphereStep3,
  SphereStep4,
  SphereStep5 
} from './LessonDiagrams';
import { UploadZone } from './UploadZone';
import { getLessonThumbnail } from './LessonThumbnails';
import { InteractiveSphere } from './InteractiveSphere';
import { InteractiveOverlappingSpheres } from './InteractiveOverlappingSpheres';
import { InteractiveAdvancedSpheres } from './InteractiveAdvancedSpheres';
import { InteractiveCube } from './InteractiveCube';
import { InteractiveCylinder } from './InteractiveCylinder';

interface LessonDetailProps {
  lesson: Lesson;
  bestScore?: number;
  onBack: () => void;
  onUpload: (file: File) => void;
  isProcessing: boolean;
}

export const LessonDetail: React.FC<LessonDetailProps> = ({ lesson, bestScore, onBack, onUpload, isProcessing }) => {
  const [headerImageError, setHeaderImageError] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-500/80 text-white border-emerald-500';
    if (score >= 70) return 'bg-sky-500/80 text-white border-sky-500';
    if (score >= 50) return 'bg-amber-500/80 text-white border-amber-500';
    return 'bg-red-500/80 text-white border-red-500';
  };

  const ImageRenderer = ({ src, alt }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    const [hasError, setHasError] = useState(false);

    // Handle "internal:" diagrams from other lessons
    if (typeof src === 'string' && src.startsWith('internal:')) {
      const type = src.split(':')[1];
      return (
        <div className="my-8 bg-stone-200 rounded-sm p-3 shadow-lg border border-stone-300">
           <div className="bg-white rounded overflow-hidden h-[300px] sm:h-[400px]">
                {renderDiagram(type)}
           </div>
          {alt && <div className="text-center text-stone-600 text-sm mt-3 font-serif italic">{alt.replace(/^Diagram:\s*/, '')}</div>}
        </div>
      );
    }

    // Fallback logic for Sphere lesson if image fails to load (404)
    if (hasError && src && typeof src === 'string') {
        let FallbackComponent = null;
        if (src.includes('the-sphere-1')) FallbackComponent = <SphereStep1 />;
        else if (src.includes('the-sphere-2')) FallbackComponent = <SphereStep2 />;
        else if (src.includes('the-sphere-3')) FallbackComponent = <SphereStep3 />;
        else if (src.includes('the-sphere-4')) FallbackComponent = <SphereStep4 />;
        else if (src.includes('the-sphere-5')) FallbackComponent = <SphereStep5 />;
        
        if (FallbackComponent) {
            return (
                <div className="my-8 bg-stone-100 p-2 rounded-sm shadow-lg border border-stone-300">
                     <div className="h-[300px] sm:h-[400px] bg-white">
                         {FallbackComponent}
                     </div>
                     <div className="p-2 text-center text-xs text-red-500 font-mono mt-2">
                        Image file not found at <code>{src}</code>. Showing fallback diagram.
                     </div>
                </div>
            )
        }
    }

    // Default renderer for standard images
    // Cleaned up style: Removed rotation and tape effect
    return (
      <figure className="my-10 group">
        <div className="bg-white p-2 pb-8 sm:p-3 sm:pb-4 rounded-sm shadow-xl border border-stone-300 max-w-2xl mx-auto relative hover:shadow-2xl transition-shadow duration-300">
            <img 
                src={typeof src === 'string' ? src : undefined} 
                alt={alt} 
                className="w-full h-auto border border-stone-100" 
                onError={() => setHasError(true)}
            />
            {alt && <figcaption className="text-center text-stone-500 text-sm mt-4 font-serif italic tracking-wide">{alt.replace(/^Image:\s*/, '')}</figcaption>}
        </div>
      </figure>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <button 
        onClick={onBack}
        className="flex items-center text-stone-400 hover:text-stone-100 mb-8 transition-colors group font-medium"
      >
        <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
        Back to Lessons
      </button>

      <div className="bg-stone-900 rounded-xl overflow-hidden border border-stone-800 shadow-2xl">
        {/* Header Image */}
        <div className="relative h-64 sm:h-80 w-full">
            {lesson.thumbnailImage && !headerImageError ? (
                <img 
                    src={lesson.thumbnailImage} 
                    alt={lesson.title} 
                    className="w-full h-full object-cover opacity-80" 
                    onError={() => setHeaderImageError(true)}
                />
            ) : (
                <div className="w-full h-full bg-stone-800 flex items-center justify-center">
                    {getLessonThumbnail(lesson.id)}
                </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/60 to-transparent"></div>
            <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 right-6">
                <div className="flex justify-between items-end mb-4">
                     <div className="flex gap-2">
                        <span className="px-3 py-1 bg-sky-600 text-white text-xs font-bold rounded shadow-sm uppercase tracking-wider border border-sky-500">
                            {lesson.difficulty}
                        </span>
                        {lesson.topics.map(t => (
                            <span key={t} className="px-3 py-1 bg-stone-950/60 backdrop-blur text-stone-300 text-xs font-bold rounded uppercase tracking-wider border border-stone-700">
                                {t}
                            </span>
                        ))}
                    </div>
                    {bestScore !== undefined && (
                        <div className={`px-4 py-2 rounded-lg border backdrop-blur flex items-center shadow-xl ${getScoreColor(bestScore)}`}>
                             <Trophy className="w-4 h-4 mr-2" />
                             <span className="font-bold text-sm tracking-wide">BEST: {bestScore}</span>
                        </div>
                    )}
                </div>
               
                <h1 className="text-4xl sm:text-5xl font-bold text-stone-100 mb-3 font-serif shadow-sm leading-tight">{lesson.title}</h1>
                <p className="text-stone-300 text-lg max-w-2xl font-light leading-relaxed">{lesson.description}</p>
            </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-12 bg-stone-900 min-h-[500px]">
            <div className="flex flex-wrap items-center gap-8 text-sm text-stone-400 mb-10 pb-8 border-b border-stone-800">
                <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-sky-400" />
                    20 min
                </div>
                <div className="flex items-center">
                    <BarChart className="w-4 h-4 mr-2 text-sky-400" />
                    Step-by-step
                </div>
                <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-sky-400" />
                    Interactive
                </div>
            </div>

            {/* Markdown Content */}
            <div className="lesson-content text-stone-300 leading-8 text-lg">
                <ReactMarkdown
                  components={{
                    h1: ({children}) => <h1 className="text-3xl font-bold text-stone-100 mt-12 mb-6 border-b border-stone-800 pb-4 font-serif">{children}</h1>,
                    h2: ({children}) => <h2 className="text-2xl font-bold text-sky-400 mt-10 mb-5 font-serif">{children}</h2>,
                    h3: ({children}) => <h3 className="text-xl font-semibold text-stone-100 mt-8 mb-4 font-serif">{children}</h3>,
                    p: ({children}) => <p className="mb-6 leading-relaxed font-light">{children}</p>,
                    ul: ({children}) => <ul className="space-y-3 mb-8 my-6 bg-stone-800/40 p-6 rounded-lg border border-stone-800/60">{children}</ul>,
                    ol: ({children}) => <ol className="space-y-3 mb-8 my-6 bg-stone-800/40 p-6 rounded-lg border border-stone-800/60 list-decimal list-inside">{children}</ol>,
                    li: ({children}) => <li className="text-stone-300 leading-relaxed pl-2">{children}</li>,
                    blockquote: ({children}) => (
                        <blockquote className="border-l-4 border-sky-500 pl-6 italic text-stone-300 my-10 bg-stone-800/40 py-6 pr-6 rounded-r-lg shadow-inner">
                            {children}
                        </blockquote>
                    ),
                    hr: () => <hr className="my-12 border-stone-800" />,
                    strong: ({children}) => <strong className="text-stone-100 font-semibold">{children}</strong>,
                    img: ImageRenderer
                  }}
                >
                  {lesson.content || "Content loading..."}
                </ReactMarkdown>
            </div>

            {/* 3D Scene Injection for Lesson 1 */}
            {lesson.id === 'lesson-1-sphere' && (
                <div className="my-12">
                     <div className="flex items-center mb-4 text-stone-100">
                        <Box className="w-5 h-5 mr-2 text-sky-400" />
                        <h3 className="text-lg font-bold font-serif">Interactive Lighting Reference</h3>
                     </div>
                     <InteractiveSphere />
                     <p className="text-sm text-stone-500 mt-2 italic text-center">
                        Rotatable 3D model. Observe how the light (top-right) affects the shadow (bottom-left).
                     </p>
                </div>
            )}

            {/* 3D Scene Injection for Lesson 2 */}
            {lesson.id === 'lesson-2-overlapping' && (
                <div className="my-12">
                     <div className="flex items-center mb-4 text-stone-100">
                        <Box className="w-5 h-5 mr-2 text-sky-400" />
                        <h3 className="text-lg font-bold font-serif">Interactive Depth Reference</h3>
                     </div>
                     <InteractiveOverlappingSpheres />
                     <p className="text-sm text-stone-500 mt-2 italic text-center">
                        Rotatable 3D model. Notice how the back sphere is darker where it meets the front one (Ambient Occlusion).
                     </p>
                </div>
            )}

            {/* 3D Scene Injection for Lesson 3 */}
            {lesson.id === 'lesson-3-adv-spheres' && (
                <div className="my-12">
                     <div className="flex items-center mb-4 text-stone-100">
                        <Box className="w-5 h-5 mr-2 text-sky-400" />
                        <h3 className="text-lg font-bold font-serif">Interactive Sphere Cluster</h3>
                     </div>
                     <InteractiveAdvancedSpheres />
                     <p className="text-sm text-stone-500 mt-2 italic text-center">
                        Complex group shading. Note how the spheres cast shadows on each other, creating depth layers.
                     </p>
                </div>
            )}

            {/* 3D Scene Injection for Lesson 4 */}
            {lesson.id === 'lesson-4-cube' && (
                <div className="my-12">
                     <div className="flex items-center mb-4 text-stone-100">
                        <Box className="w-5 h-5 mr-2 text-sky-400" />
                        <h3 className="text-lg font-bold font-serif">Interactive Planar Reference</h3>
                     </div>
                     <InteractiveCube />
                     <p className="text-sm text-stone-500 mt-2 italic text-center">
                        Unlike spheres, cubes have flat planes. Each face has a distinct value (light, medium, dark).
                     </p>
                </div>
            )}

             {/* 3D Scene Injection for Lesson 5 */}
             {lesson.id === 'lesson-5-cylinder' && (
                <div className="my-12">
                     <div className="flex items-center mb-4 text-stone-100">
                        <Box className="w-5 h-5 mr-2 text-sky-400" />
                        <h3 className="text-lg font-bold font-serif">Interactive Curved Surface Reference</h3>
                     </div>
                     <InteractiveCylinder />
                     <p className="text-sm text-stone-500 mt-2 italic text-center">
                        The core shadow is a vertical strip on the side, but the top surface remains flat and catches light differently.
                     </p>
                </div>
            )}
            
            <div className="mt-20 pt-10 border-t border-stone-800">
                <h2 className="text-3xl font-bold text-stone-100 mb-6 flex items-center font-serif">
                    <Upload className="w-8 h-8 mr-4 text-sky-400" />
                    Assignment Submission
                </h2>
                <p className="text-stone-400 mb-8 text-lg font-light">
                    Ready for feedback? Upload your practice sketch for this lesson. 
                    Gemini will grade it based on the lesson topics: <span className="text-sky-300 font-medium">{lesson.topics.join(", ")}</span>.
                </p>
                
                <div className="bg-stone-950 rounded-xl p-6 border border-stone-800 shadow-inner">
                    <UploadZone onFileSelect={onUpload} isProcessing={isProcessing} />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
