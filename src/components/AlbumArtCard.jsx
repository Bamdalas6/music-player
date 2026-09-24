import React from 'react';

export default function AlbumArtCard({ song, isPlaying, onTogglePlay }) {
  return (
    <div className="flex-1 min-h-0 w-full px-4 sm:px-6 py-1 sm:py-2 flex items-center justify-center shrink">
      <div
        onClick={onTogglePlay}
        className="group relative h-full max-h-[38vh] sm:max-h-[340px] aspect-square rounded-[20px] sm:rounded-[28px] overflow-hidden bg-[#1E1F22] shadow-2xl cursor-pointer select-none transition-transform duration-300 active:scale-[0.98] flex items-center justify-center"
      >
        {/* Cover Image */}
        <img
          src={song.cover}
          alt={song.title}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isPlaying ? 'scale-105' : 'scale-100'
          }`}
        />

        {/* Ambient Subtle Glow */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 transition-opacity duration-300 ${
            isPlaying ? 'opacity-40' : 'opacity-70'
          }`}
        />

        {/* Hover/Touch Play Indicator overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-lg">
            {isPlaying ? (
              <span className="text-lg sm:text-xl">⏸</span>
            ) : (
              <span className="text-lg sm:text-xl ml-1">▶</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
