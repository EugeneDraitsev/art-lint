import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Lesson } from '../types';
import { ArrowLeft, Clock, BarChart, CheckCircle, Upload } from 'lucide-react';
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

interface LessonDetailProps {
  lesson: Lesson;
  onBack: () => void;
  onUpload: (file: File) => void;
  isProcessing: boolean;
}

export const LessonDetail: React.FC<LessonDetailProps> = ({ lesson, onBack, onUpload, isProcessing }) => {
  const [headerImageError, setHeaderImageError] = useState(false);

  const ImageRenderer = ({ src, alt }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    const [hasError, setHasError] = useState(false);

    // Handle "internal:" diagrams from other lessons
    if (typeof src === 'string' && src.startsWith('internal:')) {
      const type = src.split(':')[1];
      return (
        <div className="my-8 bg-gray-100 rounded-xl overflow-hidden border border-gray-700 shadow-lg p-2 sm:p-4">
          <div className="aspect-w-16 aspect-h-9 w-full h-[300px] sm:h-[400px]">
            {renderDiagram(type)}
          </div>
          {alt && <div className="text-center text-gray-500 text-sm mt-2 italic font-medium">{alt.replace(/^Diagram:\s*/, '')}</div>}
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
                <div className="my-8 bg-gray-100 rounded-xl overflow-hidden border border-gray-700 shadow-lg h-[300px] sm:h-[400px]">
                     {FallbackComponent}
                     <div className="p-2 text-center text-xs text-red-400 bg-gray-900 border-t border-gray-700">
                        Image file not found at <code>{src}</code>. Showing fallback diagram.
                     </div>
                </div>
            )
        }
    }

    // Default renderer for standard images
    return (
      <figure className="my-8 bg-gray-800 p-2 rounded-xl border border-gray-700">
        <img 
            src={typeof src === 'string' ? src : undefined} 
            alt={alt} 
            className="w-full h-auto rounded-lg shadow-md" 
            onError={() => setHasError(true)}
        />
        {alt && <figcaption className="text-center text-gray-400 text-sm mt-3 font-medium">{alt.replace(/^Image:\s*/, '')}</figcaption>}
      </figure>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <button 
        onClick={onBack}
        className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors group"
      >
        <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
        Back to Lessons
      </button>

      <div className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 shadow-2xl">
        {/* Header Image */}
        <div className="relative h-64 sm:h-80 w-full">
            {lesson.thumbnailImage && !headerImageError ? (
                <img 
                    src={lesson.thumbnailImage} 
                    alt={lesson.title} 
                    className="w-full h-full object-cover" 
                    onError={() => setHeaderImageError(true)}
                />
            ) : (
                getLessonThumbnail(lesson.id)
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
            <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 right-6">
                <div className="flex gap-2 mb-3">
                    <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full uppercase tracking-wide shadow-sm">
                        {lesson.difficulty}
                    </span>
                    {lesson.topics.map(t => (
                         <span key={t} className="px-3 py-1 bg-black/40 backdrop-blur text-gray-200 text-xs font-bold rounded-full uppercase tracking-wide border border-white/10">
                            {t}
                        </span>
                    ))}
                </div>
                <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-2 shadow-sm leading-tight">{lesson.title}</h1>
                <p className="text-gray-200 text-lg max-w-2xl font-medium drop-shadow-md">{lesson.description}</p>
            </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-10 bg-gray-800 min-h-[500px]">
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 mb-8 pb-8 border-b border-gray-700">
                <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-indigo-400" />
                    20 min
                </div>
                <div className="flex items-center">
                    <BarChart className="w-4 h-4 mr-2 text-indigo-400" />
                    Step-by-step
                </div>
                <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-indigo-400" />
                    Interactive
                </div>
            </div>

            <div className="lesson-content text-gray-300 leading-relaxed text-lg">
                <ReactMarkdown
                  components={{
                    h1: ({children}) => <h1 className="text-3xl font-extrabold text-white mt-10 mb-6 border-b border-gray-800 pb-2">{children}</h1>,
                    h2: ({children}) => <h2 className="text-2xl font-bold text-indigo-400 mt-8 mb-4">{children}</h2>,
                    h3: ({children}) => <h3 className="text-xl font-semibold text-white mt-6 mb-3">{children}</h3>,
                    p: ({children}) => <p className="mb-6 leading-relaxed">{children}</p>,
                    ul: ({children}) => <ul className="space-y-3 mb-6 my-4 bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">{children}</ul>,
                    ol: ({children}) => <ol className="space-y-3 mb-6 my-4 bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 list-decimal list-inside">{children}</ol>,
                    li: ({children}) => <li className="text-gray-300 leading-relaxed text-lg">{children}</li>,
                    blockquote: ({children}) => <blockquote className="border-l-4 border-indigo-500 pl-4 italic text-gray-300 my-8 bg-gray-800/60 py-4 pr-4 rounded-r-lg shadow-sm">{children}</blockquote>,
                    hr: () => <hr className="my-10 border-gray-700" />,
                    strong: ({children}) => <strong className="text-white font-bold">{children}</strong>,
                    img: ImageRenderer
                  }}
                >
                  {lesson.content || "Content loading..."}
                </ReactMarkdown>
            </div>
            
            <div className="mt-16 pt-10 border-t border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <Upload className="w-6 h-6 mr-3 text-indigo-500" />
                    Assignment Submission
                </h2>
                <p className="text-gray-400 mb-8">
                    Ready for feedback? Upload your practice sketch for this lesson. 
                    Gemini will grade it based on the lesson topics: <span className="text-indigo-300">{lesson.topics.join(", ")}</span>.
                </p>
                
                <div className="bg-gray-900 rounded-2xl p-4 border border-gray-700/50">
                    <UploadZone onFileSelect={onUpload} isProcessing={isProcessing} />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};