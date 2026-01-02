
import React, { useState } from 'react';

interface CrashButtonProps {
  onCrash: () => void;
  isLoading: boolean;
}

export const CrashButton: React.FC<CrashButtonProps> = ({ onCrash, isLoading }) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div className="flex flex-col items-center gap-6 py-12">
      <div className="relative group">
        <div className="absolute -inset-4 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 blur"></div>
        <button
          disabled={isLoading}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onMouseLeave={() => setIsPressed(false)}
          onClick={onCrash}
          className={`relative w-48 h-48 rounded-full bg-black border-4 border-pink-500 flex items-center justify-center transition-all duration-75 shadow-2xl crash-button-glow 
            ${isPressed ? 'scale-90 bg-pink-900/20' : 'hover:scale-105'} 
            ${isLoading ? 'animate-pulse cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        >
          <span className="text-3xl font-black italic tracking-tighter text-pink-500 uppercase">
            {isLoading ? 'Wait...' : 'Crashout'}
          </span>
        </button>
      </div>
      <p className="text-white/40 text-sm font-medium tracking-wide uppercase animate-bounce">
        {isLoading ? 'Analyzing the lore...' : 'Log the absolute catastrophe'}
      </p>
    </div>
  );
};
