import React, { useState } from 'react';
import { Lesson } from '../types';
import { PlayCircle, Clock, BarChart, ChevronRight, Trophy } from 'lucide-react';
import { getLessonThumbnail } from './LessonThumbnails';

interface LessonCardProps {
  lesson: Lesson;
  bestScore?: number;
  onClick?: () => void;
}

export const LessonCard: React.FC<LessonCardProps> = ({ lesson, bestScore, onClick }) => {
  const [imageError, setImageError] = useState(false);

  const getScoreColor = (score: number) => {
      if (score >= 90) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
      if (score >= 70) return 'bg-sky-500/20 text-sky-400 border-sky-500/50';
      if (score >= 50) return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
      return 'bg-red-500/20 text-red-400 border-red-500/50';
  };

  return (
    <div 
      onClick={onClick}
      className="bg-stone-900 rounded-xl overflow-hidden shadow-lg border border-stone-800 hover:border-sky-500/50 transition-all duration-300 group cursor-pointer flex flex-col h-full transform hover:-translate-y-1 hover:shadow-2xl"
    >
      <div className="relative h-48 overflow-hidden bg-stone-950">
        <div className="w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100">
          {lesson.thumbnailImage && !imageError ? (
            <img 
              src={lesson.thumbnailImage} 
              alt={lesson.title} 
              className="w-full h-full object-cover" 
              onError={() => setImageError(true)}
            />
          ) : (
            getLessonThumbnail(lesson.id)
          )}
        </div>
        <div className="absolute inset-0 bg-stone-900/40 group-hover:bg-transparent transition-colors duration-300"></div>
        <div className="absolute top-3 right-3 bg-stone-900/90 text-stone-300 text-xs font-bold px-2 py-1 rounded border border-stone-700 backdrop-blur shadow-sm">
            {lesson.difficulty}
        </div>
        
        {bestScore !== undefined && (
            <div className={`absolute bottom-3 left-3 px-2 py-1 rounded-md text-xs font-bold border backdrop-blur flex items-center shadow-lg ${getScoreColor(bestScore)}`}>
                <Trophy className="w-3 h-3 mr-1" />
                Score: {bestScore}
            </div>
        )}
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-stone-100 mb-2 font-serif leading-tight">{lesson.title}</h3>
        <p className="text-stone-400 text-sm mb-5 line-clamp-2 flex-1 leading-relaxed">{lesson.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-5">
            {lesson.topics.map(topic => (
                <span key={topic} className="px-2 py-0.5 bg-stone-800 text-stone-400 text-[10px] uppercase tracking-wider font-semibold rounded border border-stone-700/50">
                    {topic}
                </span>
            ))}
        </div>

        <div className="flex items-center justify-between text-xs text-stone-500 pt-4 border-t border-stone-800/50 mt-auto">
            <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                20m
            </div>
            <div className="flex items-center text-sky-500 font-medium group-hover:translate-x-1 transition-transform">
                Start Lesson <ChevronRight className="w-3 h-3 ml-1" />
            </div>
        </div>
      </div>
    </div>
  );
};