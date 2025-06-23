'use client';

import React, { useState } from 'react';
import { icons } from '../icons/icons';

interface AudioControlProps {
  className?: string;
}

const AudioControl: React.FC<AudioControlProps> = ({ className = '' }) => {
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <button
      onClick={toggleMute}
      className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${className}`}
      title={isMuted ? 'Unmute' : 'Mute'}
    >
      <div className="w-6 h-6 text-gray-600">
        {isMuted ? icons.mute1 : icons.speaker}
      </div>
    </button>
  );
};

export default AudioControl; 