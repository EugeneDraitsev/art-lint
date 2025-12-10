import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, Loader2 } from 'lucide-react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect, isProcessing }) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div 
      className={`relative w-full max-w-2xl mx-auto h-80 rounded-lg border-2 border-dashed transition-all duration-300 ease-in-out flex flex-col items-center justify-center p-8 text-center
        ${dragActive ? 'border-sky-500 bg-stone-800' : 'border-stone-700 bg-stone-900/50'}
        ${isProcessing ? 'opacity-50 pointer-events-none' : 'hover:border-stone-500 hover:bg-stone-900'}
      `}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input 
        ref={inputRef}
        type="file" 
        className="hidden" 
        multiple={false} 
        accept="image/*"
        onChange={handleChange}
      />

      {isProcessing ? (
        <div className="flex flex-col items-center animate-pulse">
          <Loader2 className="w-12 h-12 text-sky-400 animate-spin mb-4" />
          <h3 className="text-xl font-semibold text-stone-200 font-serif">Gemini is analyzing your art...</h3>
          <p className="text-stone-500 mt-2">Checking perspective, anatomy, and style.</p>
        </div>
      ) : (
        <>
          <div className="w-16 h-16 bg-stone-800 rounded-full flex items-center justify-center mb-6 shadow-md border border-stone-700 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-8 h-8 text-sky-400" />
          </div>
          <h3 className="text-2xl font-bold text-stone-200 mb-2 font-serif">Upload your Drawing</h3>
          <p className="text-stone-500 mb-8 max-w-sm">
            Drag and drop your sketch, line art, or painting here.
          </p>
          <button 
            onClick={onButtonClick}
            className="px-8 py-2.5 bg-stone-100 hover:bg-white text-stone-900 rounded-md font-bold transition-colors shadow-lg"
          >
            Select File
          </button>
          <div className="mt-6 flex items-center text-xs text-stone-600 font-medium uppercase tracking-wide">
            <ImageIcon className="w-3 h-3 mr-1.5" />
            Supports JPG, PNG, WEBP
          </div>
        </>
      )}
    </div>
  );
};