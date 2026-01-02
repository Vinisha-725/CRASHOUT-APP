
import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { CrashButton } from './components/CrashButton';
import { CrashCard } from './components/CrashCard';
import { WrappedModal } from './components/WrappedModal';
import { AuthPage } from './components/AuthPage';
import { Crashout, WrappedStats, User, CrashCategory, Friend } from './types';
import { getAIFeedback, generateWrapped } from './services/geminiService';

type View = 'home' | 'vibes' | 'archive' | 'search' | 'friends';

const CATEGORIES: CrashCategory[] = [
  'Academics', 'Love Life', 'Annoying People', 'Family', 'Stress / Overthinking', 'Silly / Random', 'Other'
];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<Crashout[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [currentView, setCurrentView] = useState<View>('home');
  const [isLogging, setIsLogging] = useState(false);
  const [showWrapped, setShowWrapped] = useState(false);
  const [wrappedData, setWrappedData] = useState<WrappedStats | null>(null);
  const [currentText, setCurrentText] = useState('');
  const [userCaption, setUserCaption] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CrashCategory>('Other');
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Social state
  const [friendSearch, setFriendSearch] = useState('');
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [sharingCrashout, setSharingCrashout] = useState<Crashout | null>(null);
  
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('crashout_history');
    const savedUser = localStorage.getItem('crashout_user');
    const savedFriends = localStorage.getItem('crashout_friends');

    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedFriends) setFriends(JSON.parse(savedFriends));
    
    setIsCheckingAuth(false);
  }, []);

  useEffect(() => {
    localStorage.setItem('crashout_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('crashout_friends', JSON.stringify(friends));
  }, [friends]);

  useEffect(() => {
    if (user) localStorage.setItem('crashout_user', JSON.stringify(user));
  }, [user]);

  const handleAuth = (newUser: User) => setUser(newUser);
  const handleLogout = () => {
    localStorage.removeItem('crashout_user');
    setUser(null);
  };

  const handleCrashClick = () => {
    setIsInputVisible(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleShareApp = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'CRASHOUT',
          text: 'Join me on CRASHOUT and log your absolute chaos.💀',
          url: window.location.origin
        });
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      await navigator.clipboard.writeText(window.location.origin);
      alert('App link copied to clipboard! Send it to your ops.');
    }
  };

  const submitCrashout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentText.trim() || isLogging) return;
    setIsLogging(true);
    try {
      const aiResponse = await getAIFeedback(currentText, selectedCategory);
      const newCrash: Crashout = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        description: currentText,
        userCaption: userCaption || "Manifesting a better day...",
        category: selectedCategory,
        ...aiResponse
      };
      setHistory(prev => [newCrash, ...prev]);
      setCurrentText('');
      setUserCaption('');
      setSelectedCategory('Other');
      setIsInputVisible(false);
      setCurrentView('archive');
    } catch (error) {
      console.error("Crashout failed", error);
    } finally {
      setIsLogging(false);
    }
  };

  const handleAddFriend = () => {
    if (!friendSearch.trim()) return;
    const newFriend: Friend = {
      id: Math.random().toString(36).substr(2, 9),
      name: friendSearch.split('@')[0],
      username: friendSearch.replace('@', ''),
      status: 'CHILLING',
      lastMessageReceived: undefined
    };
    setFriends(prev => [...prev, newFriend]);
    setFriendSearch('');
  };

  const handleInternalShare = (friendId: string) => {
    if (!sharingCrashout) return;
    setFriends(prev => prev.map(f => {
      if (f.id === friendId) {
        return { ...f, lastMessageReceived: `"${sharingCrashout.userCaption}" - ${sharingCrashout.description}` };
      }
      return f;
    }));
    setSharingCrashout(null);
    alert("Lore shared to circle! 💀");
  };

  if (isCheckingAuth) return null;
  if (!user) return <AuthPage onAuth={handleAuth} />;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col max-w-lg mx-auto border-x border-white/5 relative pb-24">
      <Header setView={setCurrentView} activeView={currentView} />

      <main className="flex-grow px-6 pt-6">
        {/* HOME VIEW */}
        {currentView === 'home' && (
          <div className="space-y-8">
            <section className="text-center pt-8">
              <h2 className="text-4xl font-black italic tracking-tighter mb-2 uppercase">SUP, {user.name.split(' ')[0]}?</h2>
              <p className="text-white/40 text-sm font-medium uppercase tracking-widest">Logged in as @{user.username}</p>
            </section>
            <CrashButton onCrash={handleCrashClick} isLoading={isLogging} />
            {isInputVisible && (
              <form onSubmit={submitCrashout} className="bg-white/5 p-4 rounded-3xl border border-white/10 space-y-4">
                <textarea ref={inputRef} value={currentText} onChange={(e) => setCurrentText(e.target.value)} placeholder="Describe the absolute chaos..." className="w-full bg-black/40 border-2 border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-pink-500 transition-all text-lg font-medium resize-none h-32" />
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button key={cat} type="button" onClick={() => setSelectedCategory(cat)} className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${selectedCategory === cat ? 'bg-pink-500 border-pink-500 text-black' : 'bg-white/5 border-white/10 text-white/40'}`}>{cat}</button>
                  ))}
                </div>
                <input type="text" value={userCaption} onChange={(e) => setUserCaption(e.target.value)} placeholder="Write your lore caption..." className="w-full bg-black/40 border-2 border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-pink-500 transition-all font-bold" />
                <button type="submit" className="w-full bg-pink-500 text-black font-black uppercase tracking-widest py-4 rounded-2xl hover:bg-pink-400">Lock In The Lore</button>
              </form>
            )}
          </div>
        )}

        {/* ARCHIVE VIEW */}
        {currentView === 'archive' && (
          <div className="space-y-4">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-8">The Vault</h2>
            {history.map(crash => <CrashCard key={crash.id} crash={crash} onShare={() => setSharingCrashout(crash)} />)}
          </div>
        )}

        {/* FRIENDS VIEW */}
        {currentView === 'friends' && (
          <div className="space-y-6">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-3xl font-black italic uppercase tracking-tighter">Inner Circle</h2>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Your chaos network</p>
              </div>
              <button 
                onClick={handleShareApp}
                className="bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-green-500/20 transition-all"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M15 8l5 5-5 5" /><path d="M4 20c0-4 1.5-8 5-10 2.5-1.5 6-1.5 11 3" /></svg>
                Invite Ops
              </button>
            </div>

            <div className="flex gap-2 mb-8">
              <input type="text" value={friendSearch} onChange={e => setFriendSearch(e.target.value)} placeholder="Add @username..." className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-pink-500 outline-none" />
              <button onClick={handleAddFriend} className="bg-white text-black px-6 rounded-xl font-black uppercase text-xs">Add</button>
            </div>

            {friends.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-3xl">
                <p className="text-white/20 italic font-medium">Circle is empty.<br/>Add some ops or besties.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {friends.map(friend => (
                  <button key={friend.id} onClick={() => setSelectedFriend(friend)} className="w-full flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-pink-500/30 transition-all">
                    <div className="flex items-center gap-4 text-left">
                      <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center font-black italic">{friend.name[0]}</div>
                      <div>
                        <p className="font-bold text-white leading-none mb-1">{friend.name}</p>
                        <p className="text-[10px] text-white/40 font-mono">@{friend.username}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-pink-500 opacity-60">Vibe Check →</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SEARCH VIEW */}
        {currentView === 'search' && (
          <div className="space-y-6">
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search the lore..." className="w-full bg-white/5 border-2 border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-pink-500 font-bold" />
            {history.filter(h => h.description.includes(searchQuery)).map(crash => <CrashCard key={crash.id} crash={crash} onShare={() => setSharingCrashout(crash)} />)}
          </div>
        )}
      </main>

      {/* FOOTER NAV */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-black/80 backdrop-blur-xl border-t border-white/5 px-8 py-4 flex justify-around items-center z-50">
        <button onClick={() => setCurrentView('home')} className={currentView === 'home' ? 'text-pink-500' : 'text-white/20'}><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg></button>
        <button onClick={() => setCurrentView('search')} className={currentView === 'search' ? 'text-pink-500' : 'text-white/20'}><svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg></button>
        <button onClick={() => setCurrentView('friends')} className={currentView === 'friends' ? 'text-pink-500' : 'text-white/20'}><svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg></button>
      </nav>

      {/* FRIEND DETAIL MODAL */}
      {selectedFriend && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-[2.5rem] p-8 relative">
            <button onClick={() => setSelectedFriend(null)} className="absolute top-6 right-6 text-white/30 hover:text-white">✕</button>
            <div className="text-center mb-8">
              <div className="w-24 h-24 rounded-full bg-pink-500/20 flex items-center justify-center text-4xl mx-auto mb-4 border border-pink-500/30">💀</div>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter">@{selectedFriend.username}</h2>
              <p className="text-pink-500 text-[10px] font-black uppercase tracking-widest mt-1">INNER CIRCLE MEMBER</p>
            </div>
            <div className="bg-black/40 rounded-3xl p-6 border border-white/5">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-4">Last Lore Sent To You</p>
              {selectedFriend.lastMessageReceived ? (
                <p className="text-white font-medium italic text-sm leading-relaxed">"{selectedFriend.lastMessageReceived}"</p>
              ) : (
                <p className="text-white/10 italic text-sm">Silence is loud. They haven't crashed out to you yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SHARE SHEET MODAL */}
      {sharingCrashout && (
        <div className="fixed inset-0 z-[110] bg-black/95 flex flex-col justify-end">
          <div className="bg-[#111] rounded-t-[3rem] p-8 pb-12 max-w-lg mx-auto w-full animate-in slide-in-from-bottom-20 duration-300">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black italic uppercase tracking-tighter">Send Lore To...</h3>
              <button onClick={() => setSharingCrashout(null)} className="text-white/30">Cancel</button>
            </div>
            {friends.length === 0 ? (
              <p className="text-center py-10 text-white/20 font-bold uppercase tracking-widest">No friends found. Add some ops.</p>
            ) : (
              <div className="grid grid-cols-4 gap-4 max-h-80 overflow-y-auto pr-2">
                {friends.map(f => (
                  <button key={f.id} onClick={() => handleInternalShare(f.id)} className="flex flex-col items-center gap-2 group">
                    <div className="w-16 h-16 rounded-full bg-pink-500/10 border border-white/5 flex items-center justify-center font-black group-hover:border-pink-500 transition-all">{f.name[0]}</div>
                    <span className="text-[10px] font-bold text-white/50 truncate w-full text-center">@{f.username}</span>
                  </button>
                ))}
              </div>
            )}
            <div className="mt-8 pt-8 border-t border-white/5">
               <p className="text-center text-[10px] font-black text-white/10 uppercase tracking-[0.3em]">Lore sharing is final. No deletes.</p>
            </div>
          </div>
        </div>
      )}

      {showWrapped && wrappedData && <WrappedModal stats={wrappedData} onClose={() => setShowWrapped(false)} />}
    </div>
  );
};

export default App;
