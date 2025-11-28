import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

const ProductivityTimerWidget = () => {
  // --- THEME CONSTANTS ---
// 2brainey/vault/Vault-c56edab4e9ba95c3fc4abb92c22f46eb83c3b7f6/src/components/dashboard/productivitytimerwidget.jsx

// Lines 7-13: Replace old hardcoded definitions
const colors = { 
  gold: '#e1b542',       // vault-amber
  success: '#4ade80',    // vault-success
  bronze: '#78643e',     // vault-bronze
  slateBlue: '#404e6d',  // vault-slate
  darkBase: '#2b3446'    // vault-dark
};
// ... rest of the component uses these constants correctly for gradients and inline styles.
  const goldAccent = { color: colors.gold, textShadow: `0 0 8px ${colors.gold}80` };

  // --- STATE ---
  const defaultFocusMinutes = 25;
  const [timerActive, setTimerActive] = useState(false);
  const [focusDuration, setFocusDuration] = useState(defaultFocusMinutes);
  const [timeLeft, setTimeLeft] = useState(defaultFocusMinutes * 60);
  const [sessionType, setSessionType] = useState('DEEP WORK');

  // --- TIMER LOGIC ---
  useEffect(() => {
    let interval = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
      // Trigger completion logic here (e.g., sound effect, API update)
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  // --- HANDLERS ---
  const handleDurationChange = (e) => {
    const newDuration = parseInt(e.target.value) || 0;
    setFocusDuration(newDuration);
    if (!timerActive) setTimeLeft(newDuration * 60);
  };

  const toggleTimer = () => {
    if (timeLeft === 0) setTimeLeft(focusDuration * 60);
    setTimerActive(!timerActive);
  };

  const resetTimer = () => {
    setTimerActive(false);
    setTimeLeft(focusDuration * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="h-full w-full flex flex-col justify-between relative overflow-hidden p-6 rounded-lg border shadow-lg" 
      style={{ 
        background: `linear-gradient(180deg, ${colors.slateBlue} 0%, ${colors.darkBase} 100%)`, 
        borderColor: colors.gold,
        boxShadow: `inset 0 0 15px rgba(0,0,0,0.5)` 
      }}
    >
      {/* Background Icon Watermark */}
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <RotateCcw size={120} />
      </div>
      
      {/* Header & Display */}
      <div>
        <h3 className="flex items-center gap-2 font-extrabold mb-1 text-lg" style={goldAccent}>
          PRODUCTIVITY PROTOCOL
        </h3>
        <p className="text-xs text-white/50 mb-4 font-mono tracking-wide">SESSION: {sessionType}</p>
        
        <div className="flex items-center justify-center py-4">
          <div 
            className="font-mono font-bold tracking-tighter text-6xl" 
            style={{ 
              textShadow: `0 0 20px ${timerActive ? colors.success : colors.gold}40`, 
              color: timerActive ? colors.success : 'white' 
            }}
          >
            {formatTime(timeLeft)}
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-2 mt-2">
          <label className="text-xs text-white/60 font-mono">Duration (min):</label>
          <input 
            type="number" 
            value={focusDuration} 
            onChange={handleDurationChange} 
            min="1" 
            disabled={timerActive} 
            className="w-16 bg-black/40 text-center text-white text-sm p-1 rounded border border-white/10 focus:outline-none disabled:opacity-50" 
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3 mt-4">
        <button 
          onClick={toggleTimer} 
          className={`flex-1 py-3 rounded font-bold flex items-center justify-center gap-2 transition-all text-base ${
            timerActive 
              ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' 
              : 'bg-green-500/20 text-green-500 border border-green-500/30 hover:bg-green-500/30'
          }`}
        >
          {timerActive ? <><Pause size={18} /> PAUSE</> : <><Play size={18} /> INITIATE</>}
        </button>
        
        <button 
          onClick={resetTimer} 
          className="px-4 py-3 rounded bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
        >
          <RotateCcw size={18} />
        </button>
      </div>
    </div>
  );
};

export default ProductivityTimerWidget;