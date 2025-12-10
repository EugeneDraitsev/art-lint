import React from 'react';
import { Palette, BookOpen, Upload, Layout } from 'lucide-react';
import { AppState } from '../types';

interface HeaderProps {
  setAppState: (state: AppState) => void;
  currentState: AppState;
}

export const Header: React.FC<HeaderProps> = ({ setAppState, currentState }) => {
  return (
    <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center cursor-pointer" onClick={() => setAppState(AppState.HOME)}>
            <Palette className="h-8 w-8 text-indigo-500" />
            <span className="ml-2 text-xl font-bold text-white tracking-tight">ArtLint</span>
          </div>
          
          <nav className="flex space-x-8">
            <button
              onClick={() => setAppState(AppState.HOME)}
              className={`${
                currentState === AppState.HOME ? 'text-indigo-400' : 'text-gray-300 hover:text-white'
              } flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors`}
            >
              <Layout className="w-4 h-4 mr-2" />
              Home
            </button>
            <button
              onClick={() => setAppState(AppState.LESSONS)}
              className={`${
                currentState === AppState.LESSONS ? 'text-indigo-400' : 'text-gray-300 hover:text-white'
              } flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors`}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Lessons
            </button>
            <button
              onClick={() => setAppState(AppState.ANALYZING)} // Direct link to upload/analyze
              className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all transform hover:scale-105"
            >
              <Upload className="w-4 h-4 mr-2" />
              Check My Art
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
