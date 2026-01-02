
import React, { useState } from 'react';
import { User } from '../types';

interface AuthPageProps {
  onAuth: (user: User) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onAuth }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !username || !password) return;
    
    const user: User = { name, username: username.replace('@', '') };
    onAuth(user);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-white overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-pink-500/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-md z-10 space-y-12">
        <div className="text-center space-y-2">
          <div className="inline-block w-16 h-16 bg-pink-500 rounded-full mb-4 shadow-[0_0_30px_rgba(236,72,153,0.5)] animate-bounce"></div>
          <h1 className="text-6xl font-black italic tracking-tighter leading-none">CRASHOUT</h1>
          <p className="text-white/40 uppercase tracking-[0.3em] text-xs font-bold">The Chaos Archive</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="group">
              <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Real Name"
                required
                className="w-full bg-white/5 border-2 border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-pink-500 transition-all placeholder:text-white/10 font-bold"
              />
            </div>

            <div className="group">
              <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">Username</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 font-bold">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="chaos_lord"
                  required
                  className="w-full bg-white/5 border-2 border-white/10 rounded-2xl p-4 pl-8 text-white focus:outline-none focus:border-pink-500 transition-all placeholder:text-white/10 font-bold"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-white/5 border-2 border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-pink-500 transition-all placeholder:text-white/10 font-bold"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black py-5 rounded-2xl font-black italic text-xl uppercase tracking-tighter hover:bg-pink-500 hover:text-white transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-white/5"
          >
            Lock In
          </button>
        </form>

        <p className="text-center text-[10px] text-white/20 font-medium uppercase tracking-widest leading-relaxed">
          By entering, you agree to embrace the lore.<br/>No therapy advice allowed.
        </p>
      </div>
    </div>
  );
};
