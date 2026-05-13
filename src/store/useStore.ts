import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ModuleType, Progress, Settings } from '../types';

interface AppState {
  currentModule: ModuleType | 'home';
  setCurrentModule: (module: ModuleType | 'home') => void;
  
  progress: Progress;
  addStars: (amount: number) => void;
  completeModule: (moduleId: string) => void;
  
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
  resetProgress: () => void;
}

const initialProgress: Progress = {
  stars: 0,
  completedModules: [],
  dailyStreak: 1,
  lastPlayed: new Date().toISOString(),
};

const initialSettings: Settings = {
  soundEnabled: true,
  musicEnabled: true,
  darkMode: false,
  language: 'en',
};

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      currentModule: 'home',
      setCurrentModule: (module) => set({ currentModule: module }),
      
      progress: initialProgress,
      addStars: (amount) => set((state) => ({ 
        progress: { ...state.progress, stars: state.progress.stars + amount } 
      })),
      completeModule: (moduleId) => set((state) => ({
        progress: { 
          ...state.progress, 
          completedModules: state.progress.completedModules.includes(moduleId) 
            ? state.progress.completedModules 
            : [...state.progress.completedModules, moduleId]
        }
      })),
      
      settings: initialSettings,
      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),
      
      resetProgress: () => set({ progress: initialProgress }),
    }),
    {
      name: 'kids-learning-storage',
    }
  )
);
