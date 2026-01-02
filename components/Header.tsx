
import React from 'react';

type View = 'home' | 'vibes' | 'archive' | 'search' | 'friends';

interface HeaderProps {
  setView: (view: View) => void;
  activeView: View;
}

export const Header: React.FC<HeaderProps> = ({ setView, activeView }) => {
  return (
    <header className="flex justify-between items-center px-6 py-4 bg-black/50 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <button 
        onClick={() => setView('home')}
        className="flex items-center gap-2 group"
      >
        <div className="w-8 h-8 bg-pink-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(236,72,153,0.6)] group-active:scale-90 transition-transform"></div>
        <h1 className="text-2xl font-black tracking-tighter italic group-hover:text-pink-500 transition-colors">CRASHOUT</h1>
      </button>
      <div className="flex gap-4">
        <button 
          onClick={() => setView('vibes')}
          className={`text-[10px] font-black uppercase tracking-widest transition-colors ${activeView === 'vibes' ? 'text-pink-500 underline underline-offset-4' : 'text-white/50 hover:text-white'}`}
        >
          Vibes
        </button>
        <button 
          onClick={() => setView('archive')}
          className={`text-[10px] font-black uppercase tracking-widest transition-colors ${activeView === 'archive' ? 'text-pink-500 underline underline-offset-4' : 'text-white/50 hover:text-white'}`}
        >
          Archive
        </button>
      </div>
    </header>
  );
};
