import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface PomodoroTimerProps {
  onSessionComplete?: () => void;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onSessionComplete }) => {
  // 50 minutes work session, 10 minutes break session
  const WORK_TIME = 50 * 60; 
  const BREAK_TIME = 10 * 60;

  const [timeLeft, setTimeLeft] = useState<number>(WORK_TIME);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isBreak, setIsBreak] = useState<boolean>(false);
  const [cyclesCompleted, setCyclesCompleted] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  useEffect(() => {
    let timer: any = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (soundEnabled) {
        try {
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = isBreak ? 523.25 : 659.25; // C5 or E5 chime
          gain.gain.setValueAtTime(0.2, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 1.5);
        } catch {}
      }

      if (!isBreak) {
        setCyclesCompleted((prev) => prev + 1);
        setIsBreak(true);
        setTimeLeft(BREAK_TIME);
        setIsRunning(false);
        if (onSessionComplete) onSessionComplete();
      } else {
        setIsBreak(false);
        setTimeLeft(WORK_TIME);
        setIsRunning(false);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, isBreak, soundEnabled, onSessionComplete]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(WORK_TIME);
  };

  const switchMode = (breakMode: boolean) => {
    setIsRunning(false);
    setIsBreak(breakMode);
    setTimeLeft(breakMode ? BREAK_TIME : WORK_TIME);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const totalDuration = isBreak ? BREAK_TIME : WORK_TIME;
  const progressPercent = Math.round(((totalDuration - timeLeft) / totalDuration) * 100);

  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#1C160B] via-[#120F07] to-[#0A0804] border-2 border-[#D4AF37]/60 p-4 sm:p-5 shadow-[0_15px_40px_rgba(0,0,0,0.85)] space-y-4 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#D4AF37]/25">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-[#281F10] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-cinzel text-sm font-bold text-[#FFF3BE]">
              Imperial Pomodoro (50m / 10m)
            </h3>
            <p className="text-[10px] text-[#AA9568]">
              {isBreak ? '☕ 10-Minute Recharge Break' : '⚡ 50-Minute Sovereign Focus Session'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-1.5 rounded-lg bg-[#1B150C] border border-[#D4AF37]/30 text-[#D4AF37] hover:text-white cursor-pointer"
          title={soundEnabled ? 'Chime sound enabled' : 'Chime sound muted'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Mode Switcher Pills */}
      <div className="flex items-center justify-center space-x-2">
        <button
          onClick={() => switchMode(false)}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
            !isBreak
              ? 'bg-[#D4AF37] text-black border-white shadow-md'
              : 'bg-[#18130B] border-[#D4AF37]/30 text-[#8C8069] hover:text-white'
          }`}
        >
          ⚡ Work (50m)
        </button>
        <button
          onClick={() => switchMode(true)}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
            isBreak
              ? 'bg-emerald-500 text-black border-white shadow-md'
              : 'bg-[#18130B] border-[#D4AF37]/30 text-[#8C8069] hover:text-white'
          }`}
        >
          ☕ Break (10m)
        </button>
      </div>

      {/* Circular / Large Digital Countdown Display */}
      <div className="text-center py-4 space-y-2 relative">
        <div className="text-5xl sm:text-6xl font-mono font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5CE] via-[#D4AF37] to-[#AA771C] drop-shadow-[0_0_20px_rgba(212,175,55,0.4)]">
          {formattedTime}
        </div>
        <p className="text-[11px] text-[#A89878] font-mono">
          Cycles Completed Today: <strong className="text-[#D4AF37]">{cyclesCompleted} Sessions</strong>
        </p>

        {/* Progress bar */}
        <div className="w-full h-2 rounded-full bg-[#1C160B] border border-[#D4AF37]/30 overflow-hidden mt-3">
          <div
            className="h-full bg-gradient-to-r from-[#AA771C] via-[#FFDF00] to-[#FFF5C6] transition-all duration-500 rounded-full shadow-[0_0_10px_rgba(255,223,0,0.6)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Controls: Start/Pause & Reset */}
      <div className="flex items-center space-x-2 pt-1">
        <button
          onClick={toggleTimer}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer shadow-md transition-all ${
            isRunning
              ? 'bg-amber-950 border border-amber-500 text-amber-200 hover:bg-amber-900'
              : 'bg-gradient-to-r from-[#FFDF00] via-[#D4AF37] to-[#AA771C] text-black hover:opacity-95'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4" />
              <span>Pause Session</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-black" />
              <span>Start Session</span>
            </>
          )}
        </button>

        <button
          onClick={resetTimer}
          className="p-2.5 rounded-xl bg-[#1C160B] border border-[#D4AF37]/40 text-[#D4AF37] hover:text-white hover:bg-[#251E13] cursor-pointer transition-all"
          title="Reset timer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
