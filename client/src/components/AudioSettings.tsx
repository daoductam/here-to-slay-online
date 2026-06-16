import React from 'react';
import useAudio from '../hooks/useAudio';

interface AudioSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const AudioSettings: React.FC<AudioSettingsProps> = ({ isOpen, onClose }) => {
  const {
    bgmEnabled,
    sfxEnabled,
    bgmVolume,
    sfxVolume,
    toggleBgm,
    toggleSfx,
    setBgmVolume,
    setSfxVolume,
    playSFX
  } = useAudio();

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 99999,
        backdropFilter: 'blur(5px)'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#1c1c1c',
          border: '2px solid #fc7c37',
          borderRadius: '16px',
          padding: '4vh 5vh',
          width: '350px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          animation: 'fade-in 0.3s ease-out'
        }}
        onClick={e => e.stopPropagation()}
      >
        <h2 style={{ fontSize: '3.5vh', margin: '0 0 3vh 0', color: '#fc7c37' }}>
          Âm Thanh
        </h2>

        {/* BGM SETTING */}
        <div style={{ width: '100%', marginBottom: '3vh' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1vh' }}>
            <label style={{ fontSize: '2.2vh', cursor: 'pointer' }} htmlFor="bgm-toggle">Nhạc nền (BGM)</label>
            <input
              type="checkbox"
              id="bgm-toggle"
              checked={bgmEnabled}
              onChange={toggleBgm}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            disabled={!bgmEnabled}
            value={bgmVolume}
            onChange={e => setBgmVolume(parseFloat(e.target.value))}
            style={{
              width: '100%',
              accentColor: '#fc7c37',
              cursor: bgmEnabled ? 'pointer' : 'not-allowed',
              opacity: bgmEnabled ? 1 : 0.4
            }}
          />
        </div>

        {/* SFX SETTING */}
        <div style={{ width: '100%', marginBottom: '4vh' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1vh' }}>
            <label style={{ fontSize: '2.2vh', cursor: 'pointer' }} htmlFor="sfx-toggle">Hiệu ứng (SFX)</label>
            <input
              type="checkbox"
              id="sfx-toggle"
              checked={sfxEnabled}
              onChange={toggleSfx}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            disabled={!sfxEnabled}
            value={sfxVolume}
            onChange={e => {
              setSfxVolume(parseFloat(e.target.value));
              // Play a quick test sound
              playSFX('dice');
            }}
            style={{
              width: '100%',
              accentColor: '#fc7c37',
              cursor: sfxEnabled ? 'pointer' : 'not-allowed',
              opacity: sfxEnabled ? 1 : 0.4
            }}
          />
        </div>

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '1.2vh 0',
            fontSize: '2.2vh',
            borderRadius: '8px',
            backgroundColor: '#fc7c37',
            border: 'none',
            color: '#white',
            cursor: 'pointer',
            boxShadow: '0 4px #ca500f'
          }}
        >
          Xác nhận
        </button>
      </div>
    </div>
  );
};

export default AudioSettings;
