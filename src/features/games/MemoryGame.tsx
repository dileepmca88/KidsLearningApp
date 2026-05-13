import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../store/useStore';
import confetti from 'canvas-confetti';
import { cn } from '../../lib/utils';

const EMOJIS = ['🦁', '🦒', '🦓', '🐘', '🦛', '🦏', '🐒', '🐯'];

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const MemoryGame: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const { addStars } = useStore();

  useEffect(() => {
    initGame();
  }, []);

  const initGame = () => {
    const gameCards = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(gameCards);
    setFlippedCards([]);
    setMoves(0);
  };

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2 || cards[id].isFlipped || cards[id].isMatched) return;

    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [first, second] = newFlipped;
      if (cards[first].emoji === cards[second].emoji) {
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[first].isMatched = true;
          matchedCards[second].isMatched = true;
          setCards(matchedCards);
          setFlippedCards([]);
          
          if (matchedCards.every(c => c.isMatched)) {
            confetti({ particleCount: 150, spread: 100 });
            addStars(20);
            alert("Amazing! You found all matches! 🏆");
          }
        }, 500);
      } else {
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[first].isFlipped = false;
          resetCards[second].isFlipped = false;
          setCards(resetCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl sm:text-4xl font-black text-gray-800">Memory Match</h2>
        <div className="bg-purple-100 px-4 py-2 rounded-2xl inline-block border-2 border-purple-200">
           <p className="text-purple-700 font-bold text-sm sm:text-base">
             Instruction: Tap two cards to find matching friends! 🦁🦁
           </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4 w-full justify-between sm:justify-end">
          <div className="bg-white px-4 py-2 rounded-2xl border-2 border-gray-900 font-bold text-sm sm:text-base shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            Moves: {moves}
          </div>
          <button 
            onClick={initGame}
            className="px-4 py-2 bg-yellow-400 rounded-2xl border-2 border-gray-900 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 text-sm sm:text-base transition-all hover:bg-yellow-300"
          >
            New Game 🔄
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-4 p-3 sm:p-6 bg-white/40 backdrop-blur-sm rounded-[2.5rem] sm:rounded-[4rem] border-4 border-gray-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        {cards.map((card) => (
          <motion.button
            key={card.id}
            whileHover={{ scale: card.isMatched ? 1 : 1.05 }}
            whileTap={{ scale: card.isMatched ? 1 : 0.9 }}
            onClick={() => handleCardClick(card.id)}
            animate={card.isMatched ? { scale: [1, 1.1, 1] } : {}}
            className={cn(
              "aspect-square rounded-2xl sm:rounded-3xl border-2 sm:border-4 text-3xl sm:text-5xl flex items-center justify-center transition-all duration-500 relative transition-transform shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
              card.isMatched ? "border-green-400 bg-green-50" : "border-gray-900",
              card.isFlipped || card.isMatched ? "bg-white rotate-y-180" : "bg-gradient-to-br from-blue-400 to-blue-500"
            )}
            style={{ 
              transformStyle: 'preserve-3d',
              transform: card.isFlipped || card.isMatched ? 'rotateY(180deg)' : 'rotateY(0deg)'
            }}
          >
            {/* Front of card (Back side in memory logic) */}
            <div className={cn(
              "absolute inset-0 flex items-center justify-center backface-hidden p-2",
              (card.isFlipped || card.isMatched) ? "hidden" : "block"
            )}>
              <div className="w-full h-full rounded-xl border-2 border-dashed border-white/40 flex items-center justify-center">
                 <span className="text-white/50 text-2xl font-black">?</span>
              </div>
            </div>

            {/* Back of card (Emoji side) */}
            <div className={cn(
              "absolute inset-0 flex items-center justify-center backface-hidden",
              !(card.isFlipped || card.isMatched) ? "hidden" : "block"
            )} style={{ transform: 'rotateY(180deg)' }}>
              <span className="drop-shadow-sm">{card.emoji}</span>
              {card.isMatched && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1 border-2 border-gray-900 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                >
                  <Star size={12} className="fill-white text-white" />
                </motion.div>
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
