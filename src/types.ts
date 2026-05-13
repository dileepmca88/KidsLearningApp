export type ModuleType = 
  | 'alphabet' 
  | 'numbers' 
  | 'colors' 
  | 'shapes' 
  | 'animals' 
  | 'fruits' 
  | 'drawing' 
  | 'games' 
  | 'puzzle' 
  | 'tracing' 
  | 'quiz' 
  | 'rewards' 
  | 'settings';

export interface LearningItem {
  id: string;
  name: string;
  image?: string;
  audio?: string;
  color?: string;
  description?: string;
}

export interface Progress {
  stars: number;
  completedModules: string[];
  dailyStreak: number;
  lastPlayed: string;
}

export interface Settings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  darkMode: boolean;
  language: 'en' | 'es' | 'fr';
}
