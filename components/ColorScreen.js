// components/ColorScreen.js
import React from 'react';

const ColorScreen = ({ color }) => {
  return (
    <div className={`w-screen h-screen bg-${color}`}>
      {/* Du kannst hier zusätzliche Inhalte hinzufügen */}
    </div>
  );
};

export default ColorScreen;
