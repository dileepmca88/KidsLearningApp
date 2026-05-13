import React from 'react';
import { motion } from 'motion/react';
import { useStore } from '../../store/useStore';
import { ModuleType } from '../../types';
import { 
  Type, 
  Hash, 
  Palette, 
  Circle, 
  Dog, 
  Apple, 
  Pencil, 
  Gamepad2, 
  PenTool, 
  Brain, 
  Puzzle, 
  GraduationCap 
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface ModuleCard {
  id: ModuleType;
  title: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

const MODULES: ModuleCard[] = [
  { id: 'alphabet', title: 'Alphabets', icon: <Type size={32} />, color: 'bg-pink-400', description: 'Learn A-Z' },
  { id: 'numbers', title: 'Numbers', icon: <Hash size={32} />, color: 'bg-blue-400', description: 'Count 1-100' },
  { id: 'colors', title: 'Colors', icon: <Palette size={32} />, color: 'bg-yellow-400', description: 'Fun Colors' },
  { id: 'shapes', title: 'Shapes', icon: <Circle size={32} />, color: 'bg-purple-400', description: 'Magic Shapes' },
  { id: 'animals', title: 'Animals', icon: <Dog size={32} />, color: 'bg-green-400', description: 'Forest Friends' },
  { id: 'fruits', title: 'Fruits', icon: <Apple size={32} />, color: 'bg-orange-400', description: 'Sweet Fruits' },
  { id: 'drawing', title: 'Drawing', icon: <Pencil size={32} />, color: 'bg-red-400', description: 'Art Studio' },
  { id: 'tracing', title: 'Tracing', icon: <PenTool size={32} />, color: 'bg-cyan-400', description: 'Write it!' },
  { id: 'games', title: 'Games', icon: <Gamepad2 size={32} />, color: 'bg-indigo-400', description: 'Play Time' },
  { id: 'puzzle', title: 'Puzzle', icon: <Puzzle size={32} />, color: 'bg-amber-400', description: 'Match Shapes' },
  { id: 'quiz', title: 'Quiz', icon: <GraduationCap size={32} />, color: 'bg-teal-400', description: 'Mini Test' },
];

export const HomeScreen: React.FC = () => {
  const { setCurrentModule, progress } = useStore();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.8 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { type: "spring", bounce: 0.5 }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 sm:space-y-8"
    >
      {/* Welcome & Daily Challenge */}
      <div className="flex flex-col gap-6">
        <motion.div variants={itemVariants} className="text-center sm:text-left">
          <h1 className="text-4xl sm:text-5xl font-black text-gray-800 mb-2 drop-shadow-sm">
            Hi, Little Explorer! 👋
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 font-medium">Ready for a learning adventure today?</p>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="bg-white p-4 sm:p-6 rounded-[2rem] sm:rounded-[2.5rem] border-4 border-gray-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between overflow-hidden relative group"
        >
          <div className="relative z-10">
            <h2 className="text-xl sm:text-3xl font-black text-gray-800 mb-1 sm:mb-2">Daily Progress!</h2>
            <p className="text-sm sm:text-lg text-gray-600 font-medium mb-3 sm:mb-4">Collect stars to unlock big surprises!</p>
            <div className="flex gap-3">
              {[1, 2, 3].map((i) => (
                <motion.div 
                  key={i} 
                  animate={progress.completedModules.length >= i ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
                  transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }}
                  className={cn(
                  "w-10 h-10 rounded-2xl border-2 border-gray-900 flex items-center justify-center text-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
                  progress.completedModules.length >= i ? "bg-yellow-400 rotate-3" : "bg-gray-100 -rotate-3"
                )}>
                  {progress.completedModules.length >= i ? "⭐" : "☁️"}
                </motion.div>
              ))}
            </div>
          </div>
          <div className="bg-yellow-100 w-32 h-32 rounded-full absolute -right-8 -bottom-8 flex items-center justify-center rotate-12 group-hover:scale-110 transition-transform">
            <Brain className="w-16 h-16 text-yellow-500 opacity-50" />
          </div>
        </motion.div>
      </div>

      {/* Module Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
        {MODULES.map((module, idx) => (
          <motion.button
            key={module.id}
            variants={itemVariants}
            id={`module-${module.id}`}
            whileHover={{ 
              scale: 1.05, 
              rotate: idx % 2 === 0 ? 3 : -3,
              translateY: -5
            }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setCurrentModule(module.id)}
            className={cn(
              "group p-4 sm:p-6 rounded-[1.8rem] sm:rounded-[2.5rem] border-4 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-white text-left overflow-hidden relative transition-all",
              module.color
            )}
          >
            <div className="relative z-10 flex flex-col items-center sm:items-start gap-2 sm:gap-3 text-center sm:text-left">
              <div className="bg-white/20 p-3 sm:p-4 rounded-2xl sm:rounded-3xl group-hover:rotate-12 transition-transform">
                {React.cloneElement(module.icon as React.ReactElement, { size: 28, className: "sm:w-10 sm:h-10" })}
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black leading-tight mb-1">{module.title}</h3>
                <p className="text-xs sm:text-sm font-medium opacity-90 leading-tight">{module.description}</p>
              </div>
            </div>
            
            {/* Playful background decoration */}
            <div className="absolute -right-4 -bottom-4 opacity-20 group-hover:scale-150 group-hover:rotate-45 transition-all duration-500">
              {React.cloneElement(module.icon as React.ReactElement, { size: 100 })}
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};
