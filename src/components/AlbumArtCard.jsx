import React from 'react';

export default function AlbumArtCard({ song, isPlaying, onTogglePlay }) {
  return (
    <div className="px-6 py-2">
      <div
        onClick={onTogglePlay}
        className="group relative w-full aspect-square rounded-[28px] overflow-hidden bg-[#1E1F22] shadow-2xl cursor-pointer select-none transition-transform duration-300 active:scale-[0.98]"
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
          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-lg">
            {isPlaying ? (
              <span className="text-xl">⏸</span>
            ) : (
              <span className="text-xl ml-1">▶</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
