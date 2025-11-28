import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Brain, Zap } from 'lucide-react';
import { useGameStore } from '../../store/gamestore';

const ProductivityTimerWidget = () => {
  const { completeFocusSession, data } = useGameStore();
  const colors = { gold: '#e1b542', slateBlue: '#404e6d', darkBase: '#2b3446' };
  
  const [timerActive, setTimerActive] = useState(false);
  const [focusDuration, setFocusDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [customInput, setCustomInput] = useState('');

  useEffect(() => {
    let interval = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
      completeFocusSession(focusDuration); // Claim rewards on finish
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, focusDuration, completeFocusSession]);

  const setPreset = (mins) => {
      setFocusDuration(mins);
      setTimeLeft(mins * 60);
      setTimerActive(false);
  };

  const handleCustomStart = () => {
      const mins = parseInt(customInput) || 25;
      setPreset(mins);
  };

  const toggleTimer = () => setTimerActive(!timerActive);
  const resetTimer = () => { setTimerActive(false); setTimeLeft(focusDuration * 60); };
  const formatTime = (seconds) => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;

  return (
    <div className="h-full w-full flex flex-col justify-between p-6 rounded-lg border shadow-lg relative overflow-hidden" 
         style={{ background: `linear-gradient(180deg, ${colors.slateBlue} 0%, ${colors.darkBase} 100%)`, borderColor: colors.gold }}>
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-extrabold text-lg text-white flex items-center gap-2"><Brain size={20} className="text-pink-400"/> NEURAL SYNC</h3>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Generate Brain Matter</p>
          </div>
          <div className="text-right">
              <div className="text-xs font-bold text-slate-300">POTENTIAL</div>
              <div className="text-emerald-400 font-mono text-sm">+{Math.floor(focusDuration * 10 * (1 + focusDuration/100))} BM</div>
          </div>
      </div>

      {/* Timer Display */}
      <div className="flex-1 flex items-center justify-center py-2">
          <div className={`font-mono font-bold text-6xl ${timerActive ? 'text-emerald-400 animate-pulse' : 'text-white'}`} style={{ textShadow: '0 0 20px rgba(0,0,0,0.5)' }}>
            {formatTime(timeLeft)}
          </div>
      </div>

      {/* Controls */}
      <div className="space-y-2">
          {!timerActive ? (
              <div className="grid grid-cols-1 gap-2">
                  <button onClick={() => setPreset(25)} className="bg-slate-700/50 hover:bg-slate-600 border border-slate-600 rounded p-2 text-xs font-bold text-white flex justify-between px-4">
                      <span>SHORT CYCLE</span> <span>25 MIN</span>
                  </button>
                  <button onClick={() => setPreset(50)} className="bg-slate-700/50 hover:bg-slate-600 border border-slate-600 rounded p-2 text-xs font-bold text-white flex justify-between px-4">
                      <span>DEEP CYCLE</span> <span>50 MIN</span>
                  </button>
                  <div className="flex gap-2">
                      <input 
                        type="number" 
                        placeholder="CUSTOM" 
                        value={customInput} 
                        onChange={(e) => setCustomInput(e.target.value)} 
                        className="bg-black/40 border border-slate-600 rounded px-3 text-xs text-white w-20 focus:outline-none focus:border-emerald-500"
                      />
                      <button onClick={handleCustomStart} className="flex-1 bg-emerald-900/50 hover:bg-emerald-800 border border-emerald-700 rounded text-emerald-400 text-xs font-bold">SET</button>
                  </div>
                  <button onClick={toggleTimer} className="mt-2 w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded shadow-lg flex items-center justify-center gap-2">
                      <Play size={16} fill="currentColor" /> INITIATE LINK
                  </button>
              </div>
          ) : (
              <div className="flex gap-2">
                  <button onClick={toggleTimer} className="flex-1 py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded shadow-lg flex items-center justify-center gap-2">
                      <Pause size={16} fill="currentColor" /> PAUSE
                  </button>
                  <button onClick={resetTimer} className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded shadow-lg">
                      <RotateCcw size={16} />
                  </button>
              </div>
          )}
      </div>
    </div>
  );
};

export default ProductivityTimerWidget;