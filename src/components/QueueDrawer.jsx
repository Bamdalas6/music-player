import React from 'react';
import { X, Play, Heart, Music, Check } from 'lucide-react';

export default function QueueDrawer({
  isOpen,
  onClose,
  playlist,
  currentSong,
  onSelectSong,
  isPlaying
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#1C1D21] border border-[#2E3036] rounded-t-[32px] sm:rounded-[32px] p-6 shadow-2xl max-h-[85vh] flex flex-col relative">

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Playing Queue
            </h3>
            <p className="text-[11px] text-[#8E8E93]">
              {playlist.length} songs available
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-[#8E8E93] hover:text-white flex items-center justify-center transition-all"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Song List */}
        <div className="flex-1 overflow-y-auto no-scrollbar py-3 space-y-2">
          {playlist.map((song) => {
            const isCurrent = currentSong.id === song.id;

            return (
              <div
                key={song.id}
                onClick={() => {
                  onSelectSong(song);
                  onClose();
                }}
                className={`flex items-center gap-3 p-2.5 rounded-2xl cursor-pointer transition-all active:scale-[0.99] border ${
                  isCurrent
                    ? 'bg-[#27282E] border-white/20'
                    : 'bg-[#18191C] border-transparent hover:border-white/5'
                }`}
              >
                {/* Thumbnail */}
                <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 bg-[#25262A]">
                  <img
                    src={song.cover}
                    alt={song.title}
                    className="w-full h-full object-cover"
                  />
                  {isCurrent && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                      {isPlaying ? (
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current" />
                      )}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className={`text-xs font-bold truncate ${isCurrent ? 'text-blue-400' : 'text-white'}`}>
                    {song.title}
                  </h4>
                  <p className="text-[11px] text-[#8E8E93] truncate mt-0.5">
                    {song.artist}
                  </p>
                </div>

                {/* Genre Pill */}
                <span className="text-[10px] font-medium text-[#8E8E93] px-2 py-0.5 rounded-full bg-white/5 shrink-0">
                  {song.genre.split('/')[0].trim()}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
