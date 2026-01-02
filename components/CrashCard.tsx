
import React, { useState } from 'react';
import { Crashout } from '../types';

interface CrashCardProps {
  crash: Crashout;
  onShare?: () => void;
}

export const CrashCard: React.FC<CrashCardProps> = ({ crash, onShare }) => {
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Academics': return 'border-cyan-500 text-cyan-400';
      case 'Love Life': return 'border-pink-500 text-pink-400';
      case 'Annoying People': return 'border-orange-500 text-orange-400';
      case 'Family': return 'border-green-500 text-green-400';
      case 'Stress / Overthinking': return 'border-purple-500 text-purple-400';
      case 'Silly / Random': return 'border-yellow-500 text-yellow-400';
      default: return 'border-slate-500 text-slate-400';
    }
  };

  const dateStr = new Date(crash.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`p-5 rounded-3xl border-l-[6px] bg-white/5 backdrop-blur-md mb-6 transition-all hover:translate-x-1 ${getCategoryColor(crash.category)} shadow-2xl shadow-black/40 relative group overflow-hidden`}>
      <div className="mb-3 pr-10">
        <p className="text-xl font-black italic text-white leading-tight uppercase tracking-tight">
          {crash.userCaption}
        </p>
      </div>

      <div className="absolute top-5 right-5">
        <button 
          onClick={onShare}
          className="p-2.5 rounded-full bg-green-500/10 hover:bg-green-500/20 text-green-400 transition-all active:scale-90"
          title="Share Lore to Circle"
        >
          {/* WhatsApp style curved share arrow */}
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 8l5 5-5 5" />
            <path d="M4 20c0-4 1.5-8 5-10 2.5-1.5 6-1.5 11 3" />
          </svg>
        </button>
      </div>

      <div className="flex justify-between items-start mb-4">
        <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-50 bg-white/5 px-2 py-1 rounded-md border border-white/5">
          {crash.category}
        </span>
        <span className="text-[10px] opacity-30 font-mono">{dateStr}</span>
      </div>

      <div className="bg-black/20 p-4 rounded-2xl mb-4 border border-white/5">
        <p className="text-white/80 text-sm font-medium leading-relaxed italic">
          "{crash.description}"
        </p>
      </div>

      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/5">
        <div className="w-8 h-8 rounded-full bg-pink-500/10 flex items-center justify-center text-xs shadow-inner">💀</div>
        <div className="flex-1">
          <p className="text-[10px] font-black text-pink-500 uppercase tracking-widest mb-0.5 opacity-60">AI BRAIN FEEDBACK</p>
          <p className="text-xs italic text-white/70 font-bold leading-tight">
            "{crash.funnyQuote}"
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-1">
        <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-white/20">
          <span>Chill</span>
          <span>Drama Level {crash.dramaLevel}/10</span>
          <span>Chaos</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-1000 ease-out" 
            style={{ width: `${crash.dramaLevel * 10}%` }}
          />
        </div>
      </div>
    </div>
  );
};
