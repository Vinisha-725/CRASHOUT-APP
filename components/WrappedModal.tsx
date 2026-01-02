
import React from 'react';
import { WrappedStats } from '../types';

interface WrappedModalProps {
  stats: WrappedStats;
  onClose: () => void;
}

export const WrappedModal: React.FC<WrappedModalProps> = ({ stats, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 overflow-y-auto">
      <div className="wrapped-gradient w-full max-w-md min-h-[90vh] rounded-[2rem] p-10 flex flex-col relative shadow-[0_0_120px_rgba(236,72,153,0.4)] overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-pink-500/20 rounded-full blur-3xl"></div>

        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-12 h-12 rounded-full bg-black/30 backdrop-blur-lg flex items-center justify-center text-white font-bold hover:bg-black/50 transition-colors z-10"
        >
          ✕
        </button>
        
        <div className="text-center mt-4 mb-10 relative">
          <p className="text-white font-black uppercase tracking-[0.3em] text-[10px] mb-4 opacity-80">2024 CRASHOUT RECAP</p>
          <h2 className="text-6xl font-black italic tracking-tighter leading-[0.85] text-white uppercase drop-shadow-2xl">
            TOTAL <br/> MENACE <br/> ERA
          </h2>
        </div>

        <div className="flex-grow space-y-8 relative">
          {/* Headline */}
          <div className="text-2xl font-bold leading-tight text-white/90 italic drop-shadow-md">
            "{stats.headline}"
          </div>

          {/* Stat Lines Container */}
          <div className="space-y-4">
            {stats.statLines.map((line, idx) => (
              <div 
                key={idx} 
                className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center gap-4 transform transition-all hover:scale-[1.02]"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-sm font-bold">
                  {idx + 1}
                </div>
                <p className="text-sm font-bold uppercase tracking-tight text-white leading-snug">
                  {line}
                </p>
              </div>
            ))}
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-black/30 backdrop-blur-md rounded-2xl p-4 border border-white/5">
              <p className="text-[10px] font-black text-white/40 uppercase mb-1">Peak Day</p>
              <p className="text-lg font-black text-white truncate">{stats.mostActiveDay}</p>
            </div>
            <div className="bg-black/30 backdrop-blur-md rounded-2xl p-4 border border-white/5">
              <p className="text-[10px] font-black text-white/40 uppercase mb-1">Chaos Level</p>
              <p className="text-lg font-black text-white">{stats.chaosScore}%</p>
            </div>
          </div>

          {/* Closing Line */}
          <div className="pt-6 border-t border-white/10">
            <p className="text-center text-xl font-black italic leading-tight text-white uppercase">
              {stats.closingLine}
            </p>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full py-5 mt-10 bg-white text-black rounded-full font-black text-sm uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/20"
        >
          Stay Locked In
        </button>
      </div>
    </div>
  );
};
