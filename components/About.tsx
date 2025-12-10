import React from 'react';
import { PenTool, Cpu, Zap, Layers } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-stone-100 font-serif mb-6">About ArtLint</h1>
        <p className="text-xl text-stone-400 font-light max-w-2xl mx-auto">
          Reimagining art education with the power of generative AI.
        </p>
      </div>

      <div className="bg-stone-900 rounded-xl p-8 md:p-12 border border-stone-800 shadow-xl mb-12">
        <div className="flex items-start mb-8">
            <div className="p-3 bg-stone-800 rounded-lg mr-6 hidden sm:block">
                <PenTool className="w-8 h-8 text-sky-400" />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-stone-100 mb-4 font-serif">The Idea</h2>
                <p className="text-stone-300 leading-relaxed text-lg font-light">
                    Learning to draw is a journey of constant feedback. Traditional art classes provide this, but they aren't always accessible. 
                    ArtLint was built to bridge that gap. By acting as an always-available art tutor, we help you spot mistakes in perspective, anatomy, and lighting instantly, 
                    allowing you to improve faster than ever before.
                </p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 pt-12 border-t border-stone-800">
            <div>
                <div className="flex items-center mb-4">
                    <Cpu className="w-5 h-5 text-indigo-400 mr-2" />
                    <h3 className="text-xl font-bold text-stone-100 font-serif">AI-Powered Content</h3>
                </div>
                <p className="text-stone-400 leading-relaxed">
                    Every lesson you see on this platform, from the text instructions to the diagrams, is generated or enhanced by <strong>Google Gemini</strong>. 
                    The critiques you receive are processed in real-time by advanced vision models.
                </p>
            </div>
            <div>
                 <div className="flex items-center mb-4">
                    <Zap className="w-5 h-5 text-amber-400 mr-2" />
                    <h3 className="text-xl font-bold text-stone-100 font-serif">Future Roadmap</h3>
                </div>
                <p className="text-stone-400 leading-relaxed">
                    We are building towards <strong>Dynamic Lessons</strong>. Soon, the AI won't just critique your work—it will generate brand new, 
                    customized lesson plans and reference images on the fly based on your specific mistakes.
                </p>
            </div>
        </div>
      </div>

      <div className="bg-sky-900/10 border border-sky-900/30 rounded-lg p-6 flex items-start">
         <Layers className="w-6 h-6 text-sky-400 mr-4 flex-shrink-0 mt-1" />
         <div>
             <h4 className="text-lg font-bold text-sky-100 mb-2 font-serif">A Note on Technology</h4>
             <p className="text-sky-200/70 text-sm leading-relaxed">
                 This application utilizes the <code>gemini-2.5-flash</code> and <code>gemini-2.5-flash-image</code> models for rapid, efficient analysis. 
                 While powerful, AI can sometimes hallucinate or provide subjective feedback. Always use your artistic judgment!
             </p>
         </div>
      </div>
    </div>
  );
};