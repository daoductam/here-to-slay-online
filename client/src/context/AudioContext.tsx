import React, { createContext, useEffect, useRef, useState } from 'react';

export type BGMTrack = 'lobby' | 'gameplay' | 'battle' | 'victory';
export type SFXTrack = 'dice' | 'draw' | 'play' | 'challenge' | 'slay';

interface AudioContextType {
  bgmEnabled: boolean;
  sfxEnabled: boolean;
  bgmVolume: number;
  sfxVolume: number;
  currentTrack: BGMTrack | null;
  toggleBgm: () => void;
  toggleSfx: () => void;
  setBgmVolume: (vol: number) => void;
  setSfxVolume: (vol: number) => void;
  playBGM: (track: BGMTrack) => void;
  playSFX: (sfx: SFXTrack) => void;
  stopBGM: () => void;
}

export const AudioContext = createContext<AudioContextType>({} as AudioContextType);

const BGM_PATHS: Record<BGMTrack, string> = {
  lobby: `${process.env.PUBLIC_URL}/audio/bgm_lobby.mp3`,
  gameplay: `${process.env.PUBLIC_URL}/audio/bgm_gameplay.mp3`,
  battle: `${process.env.PUBLIC_URL}/audio/bgm_battle.mp3`,
  victory: `${process.env.PUBLIC_URL}/audio/bgm_victory.mp3`
};

const SFX_PATHS: Record<SFXTrack, string> = {
  dice: `${process.env.PUBLIC_URL}/audio/sfx_dice.mp3`,
  draw: `${process.env.PUBLIC_URL}/audio/sfx_draw.mp3`,
  play: `${process.env.PUBLIC_URL}/audio/sfx_play.mp3`,
  challenge: `${process.env.PUBLIC_URL}/audio/sfx_challenge.mp3`,
  slay: `${process.env.PUBLIC_URL}/audio/sfx_slay.mp3`
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bgmEnabled, setBgmEnabled] = useState(() => {
    const saved = localStorage.getItem('bgm_enabled');
    return saved !== null ? saved === 'true' : true;
  });
  const [sfxEnabled, setSfxEnabled] = useState(() => {
    const saved = localStorage.getItem('sfx_enabled');
    return saved !== null ? saved === 'true' : true;
  });
  const [bgmVolume, setBgmVolumeState] = useState(() => {
    const saved = localStorage.getItem('bgm_volume');
    return saved !== null ? parseFloat(saved) : 0.5;
  });
  const [sfxVolume, setSfxVolumeState] = useState(() => {
    const saved = localStorage.getItem('sfx_volume');
    return saved !== null ? parseFloat(saved) : 0.5;
  });

  const [currentTrack, setCurrentTrack] = useState<BGMTrack | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sfxRefs = useRef<Record<SFXTrack, HTMLAudioElement> | null>(null);

  // Initialize SFX audio pool on mount
  useEffect(() => {
    const pool: Record<string, HTMLAudioElement> = {};
    (Object.keys(SFX_PATHS) as SFXTrack[]).forEach(key => {
      const audio = new Audio(SFX_PATHS[key]);
      audio.preload = 'auto';
      pool[key] = audio;
    });
    sfxRefs.current = pool as Record<SFXTrack, HTMLAudioElement>;

    // Cleanup on unmount
    return () => {
      if (sfxRefs.current) {
        Object.values(sfxRefs.current).forEach(audio => {
          audio.pause();
        });
      }
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('bgm_enabled', String(bgmEnabled));
    if (audioRef.current) {
      if (bgmEnabled) {
        audioRef.current.play().catch(e => console.log('Audio autoplay blocked or failed', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [bgmEnabled]);

  useEffect(() => {
    const handleInteraction = () => {
      if (bgmEnabled && audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(() => {});
      }
    };
    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, [bgmEnabled]);

  useEffect(() => {
    localStorage.setItem('sfx_enabled', String(sfxEnabled));
  }, [sfxEnabled]);

  useEffect(() => {
    localStorage.setItem('bgm_volume', String(bgmVolume));
    if (audioRef.current) {
      audioRef.current.volume = bgmVolume;
    }
  }, [bgmVolume]);

  useEffect(() => {
    localStorage.setItem('sfx_volume', String(sfxVolume));
    if (sfxRefs.current) {
      Object.values(sfxRefs.current).forEach(audio => {
        audio.volume = sfxVolume;
      });
    }
  }, [sfxVolume]);

  const toggleBgm = () => setBgmEnabled(prev => !prev);
  const toggleSfx = () => setSfxEnabled(prev => !prev);

  const setBgmVolume = (vol: number) => {
    const cleanVol = Math.max(0, Math.min(1, vol));
    setBgmVolumeState(cleanVol);
  };

  const setSfxVolume = (vol: number) => {
    const cleanVol = Math.max(0, Math.min(1, vol));
    setSfxVolumeState(cleanVol);
  };

  const playBGM = (track: BGMTrack) => {
    if (currentTrack === track) return;

    // Fade out previous track
    if (audioRef.current) {
      const prevAudio = audioRef.current;
      let vol = prevAudio.volume;

      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

      fadeIntervalRef.current = setInterval(() => {
        vol -= 0.05;
        if (vol <= 0) {
          if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
          prevAudio.pause();
          startNewTrack(track);
        } else {
          prevAudio.volume = vol;
        }
      }, 50);
    } else {
      startNewTrack(track);
    }
  };

  const startNewTrack = (track: BGMTrack) => {
    setCurrentTrack(track);
    const audio = new Audio(BGM_PATHS[track]);
    audio.loop = true;
    audio.volume = bgmVolume;
    audioRef.current = audio;

    if (bgmEnabled) {
      audio.play().catch(e => console.log('BGM playback failed:', e));
    }
  };

  const playSFX = (sfx: SFXTrack) => {
    if (!sfxEnabled || !sfxRefs.current) return;
    const audio = sfxRefs.current[sfx];
    if (audio) {
      audio.currentTime = 0;
      audio.volume = sfxVolume;
      audio.play().catch(e => console.log('SFX playback failed:', e));
    }
  };

  const stopBGM = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setCurrentTrack(null);
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
  };

  return (
    <AudioContext.Provider
      value={{
        bgmEnabled,
        sfxEnabled,
        bgmVolume,
        sfxVolume,
        currentTrack,
        toggleBgm,
        toggleSfx,
        setBgmVolume,
        setSfxVolume,
        playBGM,
        playSFX,
        stopBGM
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
