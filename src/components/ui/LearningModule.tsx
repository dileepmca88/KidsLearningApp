import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Volume2, Star } from 'lucide-react';
import { LearningItem } from '../../types';
import { useStore } from '../../store/useStore';
import confetti from 'canvas-confetti';
import { cn } from '../../lib/utils';

interface Props {
  title: string;
  items: LearningItem[];
  color: string;
}

export const LearningModule: React.FC<Props> = ({ title, items, color }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { addStars, settings, completeModule } = useStore();
  const currentItem = items[currentIndex];

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Completed the module!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      addStars(10);
      completeModule(title.toLowerCase());
      alert("Great job! You finished " + title + "! You earned 10 stars! 🌟");
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const playSound = () => {
    if (!settings.soundEnabled) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(currentItem.name);
    
    // Try to find a high quality voice
    const voices = window.speechSynthesis.getVoices();
    const preferredLang = settings.language === 'en' ? 'en-US' : 'fr-FR';
    
    // Filter voices by language
    const langVoices = voices.filter(v => v.lang.startsWith(settings.language));
    
    // Prefer "Google" voices or "Natural" voices for better quality
    const bestVoice = langVoices.find(v => v.name.toLowerCase().includes('google')) || 
                      langVoices.find(v => v.name.toLowerCase().includes('natural')) ||
                      langVoices[0];
    
    if (bestVoice) {
      utterance.voice = bestVoice;
    }

    utterance.lang = preferredLang;
    utterance.pitch = 1.1; // Slightly higher but clear
    utterance.rate = 0.8;  // Slower rate for better clarity in learning
    utterance.volume = 1.0;
    
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6 pb-12 sm:pb-0">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl sm:text-4xl font-black text-gray-800">{title}</h2>
        <div className="text-lg sm:text-xl font-bold bg-white px-3 sm:px-4 py-1 rounded-full border-2 border-gray-900">
          {currentIndex + 1} / {items.length}
        </div>
      </div>

      <div className={cn(
        "relative aspect-square sm:aspect-video bg-white rounded-[2rem] sm:rounded-[4rem] border-4 border-gray-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center p-4 sm:p-8 overflow-hidden group",
        title === "Numbers" && "aspect-[4/5] sm:aspect-square max-w-2xl mx-auto"
      )}>
        {/* Playful Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none grid grid-cols-6 sm:grid-cols-10 gap-4 p-4 grayscale group-hover:grayscale-0 transition-all duration-700">
           {Array.from({ length: 40 }).map((_, i) => (
             <div key={i} className="flex items-center justify-center">
               <Star size={24} />
             </div>
           ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentItem.id}
            initial={{ scale: 0.1, rotate: -20, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 2, rotate: 20, opacity: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 260,
              damping: 20
            }}
            className="flex flex-col items-center gap-2 sm:gap-6 relative z-10"
          >
            <div 
              className={cn(
                "leading-none select-none drop-shadow-[0_20px_20px_rgba(0,0,0,0.2)] font-black transition-all flex items-center justify-center",
                currentItem.image ? "w-40 h-40 sm:w-64 sm:h-64" : (currentItem.name.length > 2 ? "text-[6rem] sm:text-[10rem]" : "text-[10rem] sm:text-[14rem]")
              )}
              style={{ color: currentItem.color || '#000' }}
            >
              {currentItem.image ? (
                <motion.img 
                  src={currentItem.image} 
                  alt={currentItem.name}
                  className="w-full h-full object-cover rounded-[2rem] border-4 border-gray-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                  initial={{ scale: 0.8, rotate: -5 }}
                  animate={{ scale: 1, rotate: 0 }}
                />
              ) : (
                currentItem.description || currentItem.name
              )}
            </div>
            
            <div className="flex flex-col items-center gap-4 sm:gap-6 group-hover:scale-110 transition-transform duration-500">
              {(currentItem.image || currentItem.description) && (
                <h3 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tight drop-shadow-sm text-center">
                  {currentItem.name}
                </h3>
              )}
              <motion.button
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.8 }}
                onClick={playSound}
                className="bg-purple-500 p-4 sm:p-5 rounded-3xl sm:rounded-[2rem] border-4 border-gray-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-white hover:bg-purple-400 transition-colors"
                id="play-sound-btn"
              >
                <Volume2 size={32} className="sm:w-10 sm:h-10" />
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Decorative elements */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 15, -15, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="absolute top-4 sm:top-10 left-4 sm:left-10 opacity-30 text-yellow-400"
        >
          <Star size={48} className="fill-current" />
        </motion.div>
        <motion.div 
          animate={{ scale: [1, 1.3, 1], y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 5 }}
          className="absolute bottom-4 sm:bottom-10 right-4 sm:right-10 opacity-30 text-blue-400"
        >
          <Star size={32} className="fill-current" />
        </motion.div>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center px-4 sm:px-6">
        <motion.button
          whileHover={{ scale: 1.1, x: -5 }}
          whileTap={{ scale: 0.9 }}
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-5 sm:p-7 rounded-[2rem] border-4 border-gray-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white disabled:opacity-50 disabled:shadow-none transition-all hover:bg-gray-50"
          id="prev-btn"
        >
          <ChevronLeft size={32} className="text-gray-800" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleNext}
          className="px-10 sm:px-16 py-5 sm:py-7 rounded-[2rem] border-4 border-gray-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-yellow-400 font-black text-2xl transition-all hover:bg-yellow-300 active:translate-y-[4px] active:shadow-none"
          id="next-btn"
        >
          {currentIndex === items.length - 1 ? "YAY! ✨" : "NEXT! ➡️"}
        </motion.button>
      </div>
    </div>
  );
};
