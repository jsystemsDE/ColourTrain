'use client';

interface ColorSlotProps {
  color: string;
  index: number;
  onChange: (index: number, color: string) => void;
}

const ColorSlot = ({ color, index, onChange }: ColorSlotProps) => {
  return (
    <div className="flex items-center gap-4">
      <span className="w-8 text-muted-text">{index + 1}</span>
      <input
        type="color"
        value={color}
        onChange={(e) => onChange(index, e.target.value)}
        className="h-12 w-12 cursor-pointer rounded border border-muted-text bg-transparent"
      />
      <input
        type="text"
        value={color}
        onChange={(e) => onChange(index, e.target.value)}
        className="flex-1 rounded border border-muted-text bg-container-cards p-2 text-primary-text"
      />
    </div>
  );
};

export default ColorSlot;
