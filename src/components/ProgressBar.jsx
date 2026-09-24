import React, { useRef } from 'react';

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export default function ProgressBar({ currentTime = 0, duration = 180, onSeek }) {
  const progressBarRef = useRef(null);

  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;
  const remainingSeconds = Math.max(0, duration - currentTime);

  const handleSeekClick = (e) => {
    if (!progressBarRef.current || !onSeek || duration <= 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newFraction = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(newFraction * duration);
  };

  return (
    <div className="px-4 sm:px-6 py-0.5 sm:py-1.5 select-none shrink-0">
      {/* Interactive Bar */}
      <div
        ref={progressBarRef}
        onClick={handleSeekClick}
        className="group relative h-3 sm:h-4 flex items-center cursor-pointer"
      >
        {/* Track Background */}
        <div className="w-full h-1 bg-[#2C2D32] rounded-full overflow-hidden transition-all duration-150 group-hover:h-1.5">
          {/* Progress Highlight */}
          <div
            className="h-full bg-white rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Scrubber Knob */}
        <div
          className="absolute w-3 h-3 bg-white rounded-full shadow-md -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{ left: `${progressPercent}%` }}
        />
      </div>

      {/* Timestamps */}
      <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-medium text-[#8E8E93] pt-0.5 tracking-tight">
        <span>{formatTime(currentTime)}</span>
        <span>-{formatTime(remainingSeconds)}</span>
      </div>
    </div>
  );
}
