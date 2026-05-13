import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, RotateCcw, Check } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { ALPHABETS } from '../../data/learningData';
import confetti from 'canvas-confetti';
import { cn } from '../../lib/utils';

export const TracingModule: React.FC = () => {
  const [targetCharIndex, setTargetCharIndex] = useState(0);
  const targetChar = ALPHABETS[targetCharIndex].name;
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const { addStars } = useStore();

  useEffect(() => {
    initCanvas();
  }, [targetChar]);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and set background char
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f3f4f6';
    ctx.font = 'bold 300px cursive';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(targetChar, canvas.width / 2, canvas.height / 2);
    
    // Set stroke style for tracing
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const finishTracing = () => {
    setIsDrawing(false);
    // Simple validation: just assume they did it for now, 
    // or we could check pixel density on the path.
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    addStars(5);
  };

  const nextChar = () => {
    if (targetCharIndex < ALPHABETS.length - 1) {
      setTargetCharIndex(targetCharIndex + 1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-black text-gray-800">Tracing: {targetChar}</h2>
        <div className="flex gap-2">
          <button onClick={initCanvas} className="p-2 bg-white rounded-xl border-2 border-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <RotateCcw size={24} />
          </button>
        </div>
      </div>

      <div className="relative aspect-square max-w-[500px] mx-auto bg-white rounded-[3rem] border-4 border-gray-900 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden touch-none">
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={finishTracing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={finishTracing}
          className="w-full h-full cursor-crosshair relative z-10"
        />
        <div className="absolute inset-0 flex items-center justify-center font-black text-[#f3f4f6] text-[300px] select-none pointer-events-none">
          {targetChar}
        </div>
      </div>

      <div className="flex justify-center gap-6">
        <button 
          onClick={nextChar}
          className="px-12 py-4 bg-yellow-400 rounded-2xl border-4 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black text-2xl"
        >
          NEXT LETTER!
        </button>
      </div>
    </div>
  );
};
