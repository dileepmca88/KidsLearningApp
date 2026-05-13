import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Pencil, Eraser, Trash2, Download, RotateCcw, RotateCw } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { cn } from '../../lib/utils';

export const DrawingBoard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [mode, setMode] = useState<'draw' | 'erase'>('draw');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const { addStars } = useStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match container
    const updateSize = () => {
      const rect = containerRef.current!.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      // Restore last state if available
      if (history.length > 0 && historyIndex >= 0) {
        const img = new Image();
        img.src = history[historyIndex];
        img.onload = () => ctx.drawImage(img, 0, 0);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(dataUrl);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveToHistory();
    }
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.getContext('2d')?.beginPath();
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.lineWidth = brushSize;
    ctx.strokeStyle = mode === 'erase' ? '#FFFFFF' : color;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveToHistory();
  };

  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `kids-drawing-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
    addStars(5);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const img = new Image();
      img.src = history[newIndex];
      img.onload = () => ctx.drawImage(img, 0, 0);
    }
  };

  const COLORS = ['#000000', '#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#F97316', '#EC4899'];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl sm:text-4xl font-black text-gray-800">Art Studio</h2>
        <div className="flex gap-2">
          <button onClick={undo} className="p-2 bg-white rounded-xl border-2 border-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <RotateCcw size={18} className="sm:w-5 sm:h-5" />
          </button>
          <button onClick={clearCanvas} className="p-2 bg-red-100 text-red-600 rounded-xl border-2 border-red-200">
            <Trash2 size={18} className="sm:w-5 sm:h-5" />
          </button>
          <button onClick={downloadDrawing} className="p-2 bg-green-100 text-green-600 rounded-xl border-2 border-green-200">
            <Download size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
        {/* Toolbar */}
        <div className="flex md:flex-col gap-3 sm:gap-4 bg-white p-3 sm:p-4 rounded-2xl sm:rounded-[2.5rem] border-4 border-gray-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-x-auto md:overflow-x-visible">
          {/* Brush/Erase */}
          <div className="flex md:flex-col gap-2 border-b-2 sm:border-b-0 pb-2 sm:pb-0 shrink-0">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setMode('draw')}
              className={cn("p-3 sm:p-4 rounded-2xl transition-all border-2 border-transparent", mode === 'draw' ? "bg-yellow-400 text-white border-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" : "hover:bg-gray-100")}
            >
              <Pencil size={24} className="sm:w-8 sm:h-8" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setMode('erase')}
              className={cn("p-3 sm:p-4 rounded-2xl transition-all border-2 border-transparent", mode === 'erase' ? "bg-yellow-400 text-white border-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" : "hover:bg-gray-100")}
            >
              <Eraser size={24} className="sm:w-8 sm:h-8" />
            </motion.button>
          </div>

          {/* Color Palette */}
          <div className="flex md:grid md:grid-cols-2 gap-2 shrink-0 p-1">
            {COLORS.map((c) => (
              <motion.button
                key={c}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
                onClick={() => { setColor(c); setMode('draw'); }}
                className={cn(
                  "w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] transition-transform shrink-0",
                  color === c && mode === 'draw' ? "scale-125 border-4 ring-2 ring-yellow-400" : ""
                )}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          {/* Size range & Preview */}
          <div className="flex flex-col items-center gap-4">
            <div className="hidden md:flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full border-2 border-gray-900 overflow-hidden">
               <div 
                 style={{ 
                   width: brushSize, 
                   height: brushSize, 
                   backgroundColor: mode === 'erase' ? '#fff' : color,
                   borderRadius: '50%',
                   border: mode === 'erase' ? '1px solid #ccc' : 'none'
                 }} 
               />
            </div>
            <input 
              type="range" 
              min="2" 
              max="40" 
              value={brushSize} 
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-full md:w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-400 min-w-[80px]"
            />
          </div>
        </div>

        {/* Canvas Container */}
        <div 
          ref={containerRef}
          className="flex-1 bg-white rounded-[2rem] sm:rounded-[3rem] border-4 border-gray-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] min-h-[350px] sm:min-h-[400px] overflow-hidden touch-none"
        >
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            onMouseMove={draw}
            onTouchStart={startDrawing}
            onTouchEnd={stopDrawing}
            onTouchMove={draw}
            className="cursor-crosshair w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};
