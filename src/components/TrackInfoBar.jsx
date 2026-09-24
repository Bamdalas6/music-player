import React from 'react';
import { Check } from 'lucide-react';

export default function TrackInfoBar({ song, isPlaying, isFollowed, onToggleFollow, onThumbnailClick }) {
  return (
    <div className="px-4 sm:px-6 py-1 sm:py-2 shrink-0">
      <div className="flex items-center justify-between gap-2.5 sm:gap-3">
        {/* Left Thumbnail + Animated Soundwave */}
        <div
          onClick={onThumbnailClick}
          className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden bg-[#25262A] shrink-0 cursor-pointer group shadow-sm active:scale-95 transition-transform"
        >
          <img
            src={song.cover}
            alt={song.title}
            className="w-full h-full object-cover"
          />
          {isPlaying && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-end justify-center gap-0.5 pb-2">
              <span className="w-0.5 sm:w-1 h-2.5 sm:h-3 bg-white rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-0.5 sm:w-1 h-3.5 sm:h-4 bg-white rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-0.5 sm:w-1 h-2 bg-white rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
          )}
        </div>

        {/* Center: Artist & Song Title */}
        <div className="flex-1 min-w-0 pr-1">
          <p className="text-[11px] sm:text-[12px] font-medium text-[#8E8E93] truncate leading-tight">
            {song.artist}
          </p>
          <h2 className="text-[13px] sm:text-[15px] font-bold text-white truncate tracking-tight mt-0.5">
            {song.title}
          </h2>
        </div>

        {/* Right: Follow Button */}
        <button
          type="button"
          onClick={onToggleFollow}
          className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold tracking-tight transition-all duration-200 active:scale-95 shrink-0 flex items-center gap-1 shadow-sm ${
            isFollowed
              ? 'bg-[#2C2D32] text-[#8E8E93] hover:text-white border border-[#3A3B40]'
              : 'bg-white hover:bg-neutral-200 text-black'
          }`}
        >
          {isFollowed ? (
            <>
              <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
              <span>Following</span>
            </>
          ) : (
            <span>Follow</span>
          )}
        </button>
      </div>
    </div>
  );
}
