'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { TrainingConfigData } from '@/lib/types';
import ColorFlash from '@/components/ColorFlash';
import SoundPlayer from '@/components/SoundPlayer';

interface TrainingLoopProps {
  config: TrainingConfigData;
}

const TrainingLoop = ({ config }: TrainingLoopProps) => {
  const router = useRouter();
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [playSound, setPlaySound] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isRunning || !config) return;

    const scheduleNext = () => {
      let delayMs: number;

      if (config.intervalMode === 'random') {
        const min = parseFloat(config.randomMin) || 1;
        const max = parseFloat(config.randomMax) || 3;
        const seconds = min + Math.random() * (max - min);
        delayMs = seconds * 1000;
      } else {
        delayMs = parseInt(config.interval, 10);
      }

      timeoutRef.current = setTimeout(() => {
        setCurrentColorIndex((prevIndex) => (prevIndex + 1) % config.colors.length);
        setPlaySound(true);
        setTimeout(() => setPlaySound(false), 100);
        scheduleNext();
      }, delayMs);
    };

    scheduleNext();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [config, isRunning]);

  const currentColor = config.colors[currentColorIndex] ?? '#0B0C10';
  const currentSound = config.sounds[0] ?? 'beep';

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-base-background">
      <ColorFlash color={currentColor} />
      <SoundPlayer sound={currentSound} play={playSound} />
      <div className="absolute bottom-8 flex gap-4">
        {!isRunning ? (
          <button
            onClick={() => setIsRunning(true)}
            className="rounded bg-sniper-highlight px-6 py-3 text-black"
          >
            start
          </button>
        ) : (
          <button
            onClick={() => setIsRunning(false)}
            className="rounded bg-alert-red px-6 py-3 text-white"
          >
            stop
          </button>
        )}
        <button
          onClick={() => router.back()}
          className="rounded border border-muted-text px-6 py-3 text-primary-text"
        >
          back
        </button>
      </div>
    </div>
  );
};

export default TrainingLoop;