import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../store/useStore';
import { SHAPES } from '../../data/learningData';
import confetti from 'canvas-confetti';
import { cn } from '../../lib/utils';

interface PuzzleItem {
  id: string;
  emoji: string;
  isMatched: boolean;
  targetSlot: string;
}

export const PuzzleGame: React.FC = () => {
  const [items, setItems] = useState<PuzzleItem[]>([]);
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const { addStars } = useStore();

  useEffect(() => {
    initGame();
  }, []);

  const initGame = () => {
    const selected = SHAPES.slice(0, 5);
    const puzzleItems = selected.map(s => ({
      id: s.id,
      emoji: s.description || '?',
      isMatched: false,
      targetSlot: s.id
    })).sort(() => Math.random() - 0.5);
    
    setItems(puzzleItems);
    setSlots(selected.map(s => s.id).sort(() => Math.random() - 0.5));
    setSelectedItem(null);
  };

  const handleItemClick = (id: string) => {
    setSelectedItem(id);
  };

  const handleSlotClick = (slotId: string) => {
    if (selectedItem) {
      if (selectedItem === slotId) {
        setItems(prev => prev.map(item => 
          item.id === selectedItem ? { ...item, isMatched: true } : item
        ));
        
        const matchedCount = items.filter(i => i.isMatched).length + 1;
        if (matchedCount === items.length) {
          confetti({ particleCount: 150, spread: 100 });
          addStars(20);
        }
      }
      setSelectedItem(null);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 py-4 sm:py-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl sm:text-4xl font-black text-gray-800 tracking-tight">Shape Puzzle</h2>
        <div className="bg-blue-100 px-4 py-2 rounded-2xl inline-block border-2 border-blue-200">
           <p className="text-blue-700 font-bold text-sm sm:text-base">
             Tap a shape, then tap its shadow to match! ✨
           </p>
        </div>
      </div>

      <div className="flex flex-col gap-8 sm:gap-12 bg-white/30 backdrop-blur-sm p-6 sm:p-10 rounded-[2.5rem] sm:rounded-[3.5rem] border-4 border-gray-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        {/* Items to Match */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
          <AnimatePresence>
            {items.map((item) => (
              !item.isMatched && (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleItemClick(item.id)}
                  className={cn(
                    "w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-2xl sm:rounded-3xl border-4 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-5xl sm:text-6xl transition-all",
                    selectedItem === item.id ? "ring-4 ring-yellow-400 bg-yellow-50 -translate-y-2" : ""
                  )}
                >
                  {item.emoji}
                </motion.button>
              )
            ))}
          </AnimatePresence>
        </div>

        {/* Target Slots */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-12">
          {slots.map((slot) => {
            const matchedItem = items.find(i => i.id === slot && i.isMatched);
            return (
              <motion.button 
                key={slot}
                whileHover={{ scale: matchedItem ? 1 : 1.05 }}
                whileTap={{ scale: matchedItem ? 1 : 0.95 }}
                onClick={() => handleSlotClick(slot)}
                className={cn(
                  "w-24 h-24 sm:w-36 sm:h-36 rounded-[2rem] sm:rounded-[3rem] border-4 flex items-center justify-center transition-all",
                  matchedItem 
                    ? "bg-green-400 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" 
                    : "bg-gray-300/60 border-gray-500 border-dashed hover:bg-gray-400 hover:border-gray-600 shadow-inner"
                )}
              >
                {matchedItem ? (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-5xl sm:text-7xl"
                  >
                    {matchedItem.emoji}
                  </motion.span>
                ) : (
                  <span className="text-3xl sm:text-5xl opacity-10">?</span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
      
      <div className="flex justify-center">
        <button 
          onClick={initGame}
          className="px-8 py-4 bg-yellow-400 rounded-[2rem] border-4 border-gray-900 font-black text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] active:translate-y-1 transition-all"
        >
          Reset Puzzle 🔄
        </button>
      </div>
    </div>
  );
};
