'use client';

interface SoundSelectorProps {
  sounds: string[];
  selectedSound: string;
  onChange: (sound: string) => void;
}

const ALL_SOUNDS = ['kein ton', 'beep', 'chime', 'pulse', 'alert'];

const SoundSelector = ({ selectedSound, onChange }: SoundSelectorProps) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-muted-text">sound</label>
      <select
        value={selectedSound}
        onChange={(e) => onChange(e.target.value)}
        className="rounded border border-muted-text bg-container-cards p-3 text-primary-text"
      >
        {ALL_SOUNDS.map((sound) => (
          <option key={sound} value={sound}>
            {sound}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SoundSelector;