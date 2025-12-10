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
      className={`relative w-full max-w-2xl mx-auto h-96 rounded-2xl border-4 border-dashed transition-all duration-300 ease-in-out flex flex-col items-center justify-center p-6 text-center
        ${dragActive ? 'border-indigo-500 bg-gray-800' : 'border-gray-700 bg-gray-900'}
        ${isProcessing ? 'opacity-50 pointer-events-none' : 'hover:border-gray-500'}
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
          <Loader2 className="w-16 h-16 text-indigo-500 animate-spin mb-4" />
          <h3 className="text-xl font-semibold text-white">Gemini is analyzing your art...</h3>
          <p className="text-gray-400 mt-2">Checking perspective, anatomy, and style.</p>
        </div>
      ) : (
        <>
          <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
            <UploadCloud className="w-10 h-10 text-indigo-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Upload your Drawing</h3>
          <p className="text-gray-400 mb-6 max-w-sm">
            Drag and drop your sketch, line art, or painting here, or click to browse.
          </p>
          <button 
            onClick={onButtonClick}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors shadow-lg hover:shadow-indigo-500/20"
          >
            Select File
          </button>
          <div className="mt-8 flex items-center text-xs text-gray-500">
            <ImageIcon className="w-4 h-4 mr-1" />
            Supports JPG, PNG, WEBP
          </div>
        </>
      )}
    </div>
  );
};
