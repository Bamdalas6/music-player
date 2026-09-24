import React, { useEffect, useRef } from 'react';
import { X, Music } from 'lucide-react';

export default function LyricsModal({
  isOpen,
  onClose,
  song,
  currentTime,
  isPlaying
}) {
  const scrollRef = useRef(null);

  if (!isOpen) return null;

  const lyrics = song.lyrics || [];

  // Find currently active lyric line
  let activeIndex = -1;
  for (let i = 0; i < lyrics.length; i++) {
    if (currentTime >= lyrics[i].time) {
      activeIndex = i;
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#1C1D21] border border-[#2E3036] rounded-t-[32px] sm:rounded-[32px] p-5 sm:p-6 shadow-2xl max-h-[85dvh] flex flex-col relative">

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4 text-pink-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Live Lyrics & Visualizer
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-[#8E8E93] hover:text-white flex items-center justify-center transition-all"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Audio Visualizer Bars */}
        <div className="py-3 flex items-end justify-center gap-1.5 h-14 bg-[#141517] rounded-2xl my-2 px-4 border border-white/5">
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className={`w-1.5 bg-gradient-to-t from-pink-500 to-indigo-400 rounded-full transition-all duration-100 ${
                isPlaying ? 'animate-pulse' : 'h-1.5 opacity-40'
              }`}
              style={{
                height: isPlaying ? `${Math.max(12, ((i * 17 + Math.floor(currentTime * 10)) % 40) + 8)}px` : '6px',
                animationDelay: `${i * 60}ms`
              }}
            />
          ))}
        </div>

        {/* Synced Lyrics List */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto no-scrollbar py-4 space-y-4 text-center select-none"
        >
          {lyrics.length === 0 ? (
            <p className="text-xs text-[#8E8E93] italic py-8">
              Instrumental track · No vocal lyrics available
            </p>
          ) : (
            lyrics.map((line, idx) => {
              const isPast = idx < activeIndex;
              const isCurrent = idx === activeIndex;

              return (
                <p
                  key={idx}
                  className={`transition-all duration-300 ${
                    isCurrent
                      ? 'text-base sm:text-lg font-extrabold text-white scale-105'
                      : isPast
                      ? 'text-xs sm:text-sm font-medium text-[#636469]'
                      : 'text-xs sm:text-sm font-medium text-[#444549]'
                  }`}
                >
                  {line.text}
                </p>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
