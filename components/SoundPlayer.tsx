'use client';

import { useEffect, useRef } from 'react';

interface SoundPlayerProps {
  sound: string;
  play: boolean;
}

const soundProfiles: Record<string, { freq: number; type: OscillatorType }> = {
  beep: { freq: 1000, type: 'square' },
  radial: { freq: 880, type: 'square' },
  arpeggio: { freq: 660, type: 'square' },
  aufbruch: { freq: 440, type: 'square' },
  berghütte: { freq: 330, type: 'square' },
  blätterdach: { freq: 550, type: 'square' },
  eilmeldung: { freq: 990, type: 'square' },
  entfaltung: { freq: 500, type: 'square' },
  klecks: { freq: 400, type: 'square' },
  'little bird': { freq: 1200, type: 'square' },
  märchenstunde: { freq: 350, type: 'square' },
  merkur: { freq: 720, type: 'square' },
};

const SoundPlayer = ({ sound, play }: SoundPlayerProps) => {
  const ctxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!play) return;
    if (sound === 'kein ton') return;

    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    const ctx = ctxRef.current;
    const profile = soundProfiles[sound] ?? soundProfiles.beep;

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = profile.type;
    oscillator.frequency.setValueAtTime(profile.freq, ctx.currentTime);

    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.9, now + 0.005);
    gain.gain.setValueAtTime(0.9, now + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start(now);
    oscillator.stop(now + 0.2);
  }, [sound, play]);

  return null;
};

export default SoundPlayer;