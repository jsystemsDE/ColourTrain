'use client';

interface ColorFlashProps {
  color: string;
}

const ColorFlash = ({ color }: ColorFlashProps) => {
  return (
    <div
      className="fixed inset-0 transition-colors duration-150"
      style={{ backgroundColor: color }}
    />
  );
};

export default ColorFlash;