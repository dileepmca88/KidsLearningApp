/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { useStore } from './store/useStore';
import { AppLayout } from './components/layout/AppLayout';
import { HomeScreen } from './features/home/HomeScreen';
import { LearningModule } from './components/ui/LearningModule';
import { DrawingBoard } from './features/drawing/DrawingBoard';
import { MemoryGame } from './features/games/MemoryGame';
import { QuizModule } from './features/quiz/QuizModule';
import { SettingsScreen } from './features/settings/SettingsScreen';
import { TracingModule } from './features/tracing/TracingModule';
import { PuzzleGame } from './features/games/PuzzleGame';
import { 
  ALPHABETS, 
  NUMBERS, 
  COLORS, 
  SHAPES, 
  ANIMALS, 
  FRUITS 
} from './data/learningData';

export default function App() {
  const { currentModule, settings } = useStore();

  useEffect(() => {
    // Basic body class for dark mode/theme
    if (settings.darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [settings.darkMode]);

  const renderContent = () => {
    switch (currentModule) {
      case 'home':
        return <HomeScreen />;
      case 'alphabet':
        return <LearningModule title="Alphabets" items={ALPHABETS} color="pink" />;
      case 'numbers':
        return <LearningModule title="Numbers" items={NUMBERS} color="blue" />;
      case 'colors':
        return <LearningModule title="Colors" items={COLORS} color="yellow" />;
      case 'shapes':
        return <LearningModule title="Shapes" items={SHAPES} color="purple" />;
      case 'animals':
        return <LearningModule title="Animals" items={ANIMALS} color="green" />;
      case 'fruits':
        return <LearningModule title="Fruits" items={FRUITS} color="orange" />;
      case 'drawing':
        return <DrawingBoard />;
      case 'games':
        return <MemoryGame />;
      case 'puzzle':
        return <PuzzleGame />;
      case 'tracing':
        return <TracingModule />;
      case 'quiz':
        return <QuizModule />;
      case 'settings':
        return <SettingsScreen />;
      case 'rewards':
        return (
          <div className="flex flex-col items-center justify-center space-y-6 p-12 bg-white rounded-[3rem] border-4 border-gray-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-4xl font-black text-gray-800">My Rewards</h2>
            <div className="text-[10rem] drop-shadow-xl animate-bounce">🏆</div>
            <p className="text-2xl text-gray-600 font-bold">Keep learning to unlock more trophies!</p>
            <div className="grid grid-cols-3 gap-4">
              {['🌟', '🥇', '🍓', '🦄', '🌈', '💎'].map((r, i) => (
                <div key={i} className="w-20 h-20 bg-gray-50 rounded-2xl border-4 border-gray-900 flex items-center justify-center text-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  {i < Math.floor(useStore.getState().progress.stars / 20) ? r : '🔒'}
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return <HomeScreen />;
    }
  };

  return (
    <AppLayout>
      {renderContent()}
    </AppLayout>
  );
}
