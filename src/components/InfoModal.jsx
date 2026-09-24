import React from 'react';
import { X, Disc, User, Calendar, Radio, Sparkles } from 'lucide-react';

export default function InfoModal({ isOpen, onClose, song }) {
  if (!isOpen || !song) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#1C1D21] border border-[#2E3036] rounded-t-[32px] sm:rounded-[32px] p-6 shadow-2xl space-y-4">

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h3 className="text-base font-bold text-white tracking-tight">
            Track Specifications
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-[#8E8E93] hover:text-white flex items-center justify-center transition-all"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info Rows */}
        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#222328]">
            <span className="text-[#8E8E93] flex items-center gap-2">
              <Disc className="w-4 h-4 text-blue-400" />
              <span>Album</span>
            </span>
            <span className="font-semibold text-white">{song.album}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#222328]">
            <span className="text-[#8E8E93] flex items-center gap-2">
              <User className="w-4 h-4 text-purple-400" />
              <span>Artist</span>
            </span>
            <span className="font-semibold text-white">{song.artist}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#222328]">
            <span className="text-[#8E8E93] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Release Year</span>
            </span>
            <span className="font-semibold text-white">{song.year}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#222328]">
            <span className="text-[#8E8E93] flex items-center gap-2">
              <Radio className="w-4 h-4 text-amber-400" />
              <span>Audio Fidelity</span>
            </span>
            <span className="font-semibold text-white">{song.bitrate}</span>
          </div>
        </div>

        {/* Tags */}
        <div>
          <span className="text-[11px] font-semibold text-[#8E8E93] block mb-2">
            Associated Tags & Moods
          </span>
          <div className="flex flex-wrap gap-1.5">
            {song.moods?.map((m) => (
              <span
                key={m}
                className="px-2.5 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] text-white/80"
              >
                #{m}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
