import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../store/useStore';
import { ALPHABETS, ANIMALS, FRUITS, COLORS } from '../../data/learningData';
import confetti from 'canvas-confetti';
import { Check, X, Star } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Question {
  id: string;
  question: string;
  answer: string;
  options: string[];
  type: 'image' | 'text';
}

export const QuizModule: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  
  const { addStars } = useStore();

  useEffect(() => {
    initQuiz();
  }, []);

  const initQuiz = () => {
    const allData = [...ALPHABETS, ...ANIMALS, ...FRUITS];
    const newQuestions: Question[] = [];
    
    // Generate 5 random questions
    for (let i = 0; i < 5; i++) {
      const correct = allData[Math.floor(Math.random() * allData.length)];
      const options = [correct.name];
      while (options.length < 4) {
        const option = allData[Math.floor(Math.random() * allData.length)].name;
        if (!options.includes(option)) options.push(option);
      }
      
      newQuestions.push({
        id: correct.id,
        question: `Find the ${correct.name}!`,
        answer: correct.name,
        options: options.sort(() => Math.random() - 0.5),
        type: 'text'
      });
    }
    
    setQuestions(newQuestions);
    setCurrentIdx(0);
    setScore(0);
    setShowResult(false);
  };

  const handleAnswer = (option: string) => {
    if (feedback) return;
    
    if (option === questions[currentIdx].answer) {
      setFeedback('correct');
      setScore(score + 1);
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
      setTimeout(() => {
        if (currentIdx < questions.length - 1) {
          setCurrentIdx(currentIdx + 1);
          setFeedback(null);
        } else {
          finishQuiz();
        }
      }, 1000);
    } else {
      setFeedback('wrong');
      setTimeout(() => {
        setFeedback(null);
        if (currentIdx < questions.length - 1) {
          setCurrentIdx(currentIdx + 1);
        } else {
          finishQuiz();
        }
      }, 1000);
    }
  };

  const finishQuiz = () => {
    setShowResult(true);
    addStars(score * 5);
  };

  if (showResult) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 sm:space-y-8 bg-white p-6 sm:p-8 rounded-[2rem] sm:rounded-[3rem] border-4 border-gray-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-3xl sm:text-5xl font-black text-gray-800">Quiz Over!</h2>
        <div className="flex flex-col items-center gap-2">
          <div className="text-6xl sm:text-8xl font-black text-yellow-400 drop-shadow-lg">{score} / 5</div>
          <div className="text-lg sm:text-xl font-bold text-gray-500 uppercase tracking-widest">Correct Answers</div>
        </div>
        <div className="flex items-center gap-2 bg-yellow-100 px-4 sm:px-6 py-2 sm:py-3 rounded-2xl border-2 border-yellow-300">
          <Star className="text-yellow-500 fill-yellow-500 w-5 h-5 sm:w-6 sm:h-6" />
          <span className="font-black text-yellow-700 text-sm sm:text-base">+{score * 5} Total Stars</span>
        </div>
        <button 
          onClick={initQuiz}
          className="px-6 sm:px-8 py-3 sm:py-4 bg-purple-400 text-white rounded-2xl border-4 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black text-xl sm:text-2xl"
        >
          Try Again!
        </button>
      </div>
    );
  }

  if (questions.length === 0) return null;

  const currentQ = questions[currentIdx];

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl sm:text-4xl font-black text-gray-800 tracking-tight">Mini Quiz</h2>
        <div className="font-black bg-white px-4 sm:px-6 py-1 sm:py-2 rounded-full border-2 border-gray-900 text-sm sm:text-base">
          Q{currentIdx + 1}
        </div>
      </div>

      <div className="bg-white p-4 sm:p-8 rounded-[2rem] sm:rounded-[3rem] border-4 border-gray-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
        <h3 className="text-xl sm:text-3xl font-black text-center mb-6 sm:mb-8 px-2">{currentQ.question}</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {currentQ.options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleAnswer(opt)}
              className={cn(
                "p-4 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border-4 border-gray-900 text-xl sm:text-2xl font-black transition-all transform",
                feedback === 'correct' && opt === currentQ.answer ? "bg-green-400 text-white translate-y-[-4px]" :
                feedback === 'wrong' && opt !== currentQ.answer ? "bg-red-400 text-white opacity-50" : 
                "bg-blue-50 text-gray-800 hover:bg-blue-100 active:translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              )}
            >
              {opt}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              {feedback === 'correct' ? (
                <div className="bg-green-400 p-8 rounded-full border-8 border-white shadow-2xl">
                  <Check size={80} className="text-white" strokeWidth={4} />
                </div>
              ) : (
                <div className="bg-red-400 p-8 rounded-full border-8 border-white shadow-2xl">
                  <X size={80} className="text-white" strokeWidth={4} />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full bg-gray-200 h-4 rounded-full border-2 border-gray-900 overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(currentIdx / questions.length) * 100}%` }}
          className="bg-yellow-400 h-full"
        />
      </div>
    </div>
  );
};
