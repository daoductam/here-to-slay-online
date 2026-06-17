import React, { useEffect, useRef } from 'react';

interface Timer {
  type: 'turn' | 'challenge' | 'modify';
  timeLeft: number;
  maxTime: number;
}

interface TimerBarProps {
  timer?: Timer | null;
}

export const TimerBar: React.FC<TimerBarProps> = ({ timer }) => {
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!timer) {
      lastTimeRef.current = null;
      return;
    }

    // Play synthesized tick sound on second change when time is low (<= 5s)
    if (timer.timeLeft <= 5 && timer.timeLeft > 0 && timer.timeLeft !== lastTimeRef.current) {
      lastTimeRef.current = timer.timeLeft;
      playTick();
    }
  }, [timer]);

  if (!timer) return null;

  const percentage = (timer.timeLeft / timer.maxTime) * 100;
  
  // Determine color based on time left
  let color = '#2ecc71'; // Green
  let isDanger = false;
  if (timer.timeLeft <= 5) {
    color = '#e74c3c'; // Red
    isDanger = true;
  } else if (timer.timeLeft <= 10) {
    color = '#f1c40f'; // Yellow
  }

  // Label text
  let label = 'Your Turn';
  if (timer.type === 'challenge') {
    label = 'Challenge Window';
  } else if (timer.type === 'modify') {
    label = 'Modifier Window';
  }

  return (
    <div className={`timer-bar-container ${isDanger ? 'danger-blink' : ''}`}>
      <div className="timer-bar-info">
        <span className="timer-bar-label">{label}</span>
        <span className="timer-bar-time" style={{ color }}>{timer.timeLeft}s</span>
      </div>
      <div className="timer-bar-track">
        <div 
          className="timer-bar-fill" 
          style={{ 
            width: `${percentage}%`, 
            backgroundColor: color,
            transition: 'width 1s linear, background-color 0.5s ease'
          }}
        />
      </div>
      <style>{`
        .timer-bar-container {
          width: 100%;
          max-width: 400px;
          margin: 10px auto;
          background: rgba(0, 0, 0, 0.6);
          border-radius: 8px;
          padding: 12px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(5px);
          box-sizing: border-box;
        }
        .timer-bar-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .timer-bar-label {
          color: #fff;
          font-weight: 600;
          font-size: 14px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .timer-bar-time {
          font-weight: 700;
          font-size: 16px;
        }
        .timer-bar-track {
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }
        .timer-bar-fill {
          height: 100%;
          border-radius: 4px;
        }
        @keyframes blink {
          0% { box-shadow: 0 0 5px rgba(231, 76, 60, 0.2); }
          50% { box-shadow: 0 0 15px rgba(231, 76, 60, 0.8), border-color: rgba(231, 76, 60, 0.6); }
          100% { box-shadow: 0 0 5px rgba(231, 76, 60, 0.2); }
        }
        .danger-blink {
          animation: blink 1s infinite;
        }
      `}</style>
    </div>
  );
};

// Synth function using Web Audio API to create a crisp click sound
const playTick = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.frequency.setValueAtTime(800, audioCtx.currentTime); // 800 Hz click
    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08); // Decays in 80ms
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.08);
  } catch (e) {
    // Autoplay restrictions
  }
};
