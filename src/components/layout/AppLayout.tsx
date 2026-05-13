import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../store/useStore';
import { Star, Settings as SettingsIcon, Home, Trophy } from 'lucide-react';
import { cn } from '../../lib/utils';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentModule, setCurrentModule, progress } = useStore();

  return (
    <div className="min-h-screen bg-[#FFFBEB] font-sans selection:bg-yellow-200 overflow-x-hidden relative">
      {/* Background Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-yellow-200/50 rounded-full blob animate-float" />
        <div className="absolute top-[60%] right-[10%] w-96 h-96 bg-purple-200/50 rounded-full blob animate-float-delayed" />
        <div className="absolute bottom-[10%] left-[15%] w-72 h-72 bg-blue-200/50 rounded-full blob animate-float-slow" />
        <div className="absolute top-[40%] left-[50%] w-48 h-48 bg-pink-200/50 rounded-full blob animate-float" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 px-4 py-3 bg-white/70 backdrop-blur-lg border-b-4 border-yellow-400">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => setCurrentModule('home')}
            className="flex items-center gap-2 group transition-all"
            id="home-btn"
          >
            <div className="bg-yellow-400 p-2 rounded-2xl group-hover:rotate-12 transition-transform shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Home className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black text-gray-800 tracking-tight hidden sm:block">
              KIDS FUN!
            </span>
          </button>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full border-2 border-yellow-400 shadow-[2px_2px_0px_0px_rgba(254,202,27,1)]">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span className="font-black text-yellow-700">{progress.stars}</span>
            </div>
            
            <button 
              onClick={() => setCurrentModule('settings')}
              className={cn(
                "p-2 rounded-2xl transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
                currentModule === 'settings' ? "bg-purple-400" : "bg-blue-400 hover:bg-blue-300"
              )}
              id="settings-btn"
            >
              <SettingsIcon className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 pb-32 sm:pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentModule}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, y: -10 }}
            transition={{ duration: 0.3, type: "spring", bounce: 0.4 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Nav for Mobile */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white px-6 py-4 rounded-3xl border-4 border-gray-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex gap-8 z-50 sm:hidden">
        <button onClick={() => setCurrentModule('home')} className="p-1">
          <Home className={cn("w-8 h-8", currentModule === 'home' ? "text-yellow-500" : "text-gray-400")} />
        </button>
        <button onClick={() => setCurrentModule('rewards')} className="p-1">
          <Trophy className={cn("w-8 h-8", currentModule === 'rewards' ? "text-purple-500" : "text-gray-400")} />
        </button>
      </nav>
    </div>
  );
};
