import React from 'react';
import { motion } from 'motion/react';
import { useStore } from '../../store/useStore';
import { 
  Volume2, 
  VolumeX, 
  Music, 
  Globe, 
  Moon, 
  Sun, 
  RotateCcw,
  Star
} from 'lucide-react';
import { cn } from '../../lib/utils';

export const SettingsScreen: React.FC = () => {
  const { settings, updateSettings, resetProgress, progress } = useStore();

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all your stars and progress? This cannot be undone!")) {
      resetProgress();
      alert("Progress reset successfully!");
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-4xl font-black text-gray-800">Settings</h2>

      <div className="bg-white p-8 rounded-[3rem] border-4 border-gray-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-8">
        {/* Progress Overview */}
        <div className="flex items-center gap-6 p-6 bg-yellow-50 rounded-3xl border-2 border-yellow-200">
          <div className="bg-yellow-400 p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
            <Star size={40} className="text-white fill-white" />
          </div>
          <div>
            <div className="text-3xl font-black text-yellow-800">{progress.stars}</div>
            <div className="text-yellow-600 font-bold uppercase tracking-wider">Current Stars</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sound Toggles */}
          <section className="space-y-4">
            <h3 className="text-xl font-black text-gray-700">Audio</h3>
            <div className="space-y-3">
              <button 
                onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all",
                  settings.soundEnabled ? "bg-green-50 border-green-400" : "bg-gray-50 border-gray-200"
                )}
              >
                <div className="flex items-center gap-3">
                  {settings.soundEnabled ? <Volume2 className="text-green-600" /> : <VolumeX className="text-gray-400" />}
                  <span className={cn("font-bold", settings.soundEnabled ? "text-green-700" : "text-gray-500")}>Sound Effects</span>
                </div>
                <div className={cn(
                  "w-12 h-6 rounded-full relative transition-colors",
                  settings.soundEnabled ? "bg-green-400" : "bg-gray-300"
                )}>
                  <div className={cn(
                    "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                    settings.soundEnabled ? "left-7" : "left-1"
                  )} />
                </div>
              </button>

              <button 
                onClick={() => updateSettings({ musicEnabled: !settings.musicEnabled })}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all",
                  settings.musicEnabled ? "bg-green-50 border-green-400" : "bg-gray-50 border-gray-200"
                )}
              >
                <div className="flex items-center gap-3">
                  <Music className={cn(settings.musicEnabled ? "text-green-600" : "text-gray-400")} />
                  <span className={cn("font-bold", settings.musicEnabled ? "text-green-700" : "text-gray-500")}>Background Music</span>
                </div>
                <div className={cn(
                  "w-12 h-6 rounded-full relative transition-colors",
                  settings.musicEnabled ? "bg-green-400" : "bg-gray-300"
                )}>
                  <div className={cn(
                    "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                    settings.musicEnabled ? "left-7" : "left-1"
                  )} />
                </div>
              </button>
            </div>
          </section>

          {/* Theme & Language */}
          <section className="space-y-4">
            <h3 className="text-xl font-black text-gray-700">Display</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border-2 border-gray-200">
                <div className="flex items-center gap-3">
                  <Globe size={20} className="text-blue-500" />
                  <span className="font-bold text-gray-700">Language</span>
                </div>
                <select 
                  value={settings.language}
                  onChange={(e) => updateSettings({ language: e.target.value as any })}
                  className="bg-white border-2 border-gray-300 rounded-lg px-2 py-1 font-bold outline-none focus:border-blue-400"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                </select>
              </div>

              <div className="p-4 bg-red-50 rounded-2xl border-2 border-red-200">
                <button 
                  onClick={handleReset}
                  className="w-full flex items-center gap-3 text-red-600 font-bold"
                >
                  <RotateCcw size={20} />
                  <span>Reset All Progress</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
