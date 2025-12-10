import React, { useState } from 'react';
import { Lesson } from '../types';
import { PlayCircle, Clock, BarChart } from 'lucide-react';
import { getLessonThumbnail } from './LessonThumbnails';

interface LessonCardProps {
  lesson: Lesson;
  onClick?: () => void;
}

export const LessonCard: React.FC<LessonCardProps> = ({ lesson, onClick }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div 
      onClick={onClick}
      className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 hover:border-indigo-500 transition-all duration-300 group cursor-pointer flex flex-col h-full transform hover:-translate-y-1"
    >
      <div className="relative h-48 overflow-hidden bg-gray-900">
        <div className="w-full h-full group-hover:scale-110 transition-transform duration-500">
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
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <PlayCircle className="w-12 h-12 text-white drop-shadow-lg transform scale-90 group-hover:scale-100 transition-transform" />
        </div>
        <div className="absolute top-2 right-2 bg-gray-900/80 text-white text-xs px-2 py-1 rounded backdrop-blur">
            {lesson.difficulty}
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{lesson.title}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-1">{lesson.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
            {lesson.topics.map(topic => (
                <span key={topic} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-md">
                    {topic}
                </span>
            ))}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-700">
            <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                15 min
            </div>
            <div className="flex items-center">
                <BarChart className="w-3 h-3 mr-1" />
                Step-by-step
            </div>
        </div>
      </div>
    </div>
  );
};