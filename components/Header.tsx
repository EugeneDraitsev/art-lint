import React from 'react';
import { Palette, BookOpen, Upload, Layout, Info } from 'lucide-react';
import { AppState } from '../types';

interface HeaderProps {
  setAppState: (state: AppState) => void;
  currentState: AppState;
}

export const Header: React.FC<HeaderProps> = ({ setAppState, currentState }) => {
  return (
    <header className="sticky top-0 z-50 bg-stone-950/95 backdrop-blur border-b border-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center cursor-pointer group" onClick={() => setAppState(AppState.HOME)}>
            <div className="p-1.5 bg-stone-900 rounded-lg border border-stone-800 group-hover:border-stone-700 transition-colors">
                 <Palette className="h-6 w-6 text-sky-400" />
            </div>
            <span className="ml-3 text-xl font-bold text-stone-100 tracking-tight font-serif">ArtLint</span>
          </div>
          
          <nav className="flex items-center space-x-2 sm:space-x-6">
             <div className="hidden md:flex space-x-6">
                <button
                onClick={() => setAppState(AppState.HOME)}
                className={`${
                    currentState === AppState.HOME ? 'text-sky-400' : 'text-stone-400 hover:text-stone-200'
                } flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors`}
                >
                <Layout className="w-4 h-4 mr-2" />
                Home
                </button>
                <button
                onClick={() => setAppState(AppState.LESSONS)}
                className={`${
                    currentState === AppState.LESSONS ? 'text-sky-400' : 'text-stone-400 hover:text-stone-200'
                } flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors`}
                >
                <BookOpen className="w-4 h-4 mr-2" />
                Lessons
                </button>
                 <button
                onClick={() => setAppState(AppState.ABOUT)}
                className={`${
                    currentState === AppState.ABOUT ? 'text-sky-400' : 'text-stone-400 hover:text-stone-200'
                } flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors`}
                >
                <Info className="w-4 h-4 mr-2" />
                About
                </button>
            </div>

            <button
              onClick={() => setAppState(AppState.ANALYZING)}
              className="bg-stone-100 hover:bg-white text-stone-900 border border-transparent flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
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