import React from 'react';
import { ArrowLeft, Info } from 'lucide-react';

export default function TopBar({ onBack, onInfoClick }) {
  return (
    <div className="flex items-center justify-between px-6 pt-2 pb-3">
      {/* Back Button */}
      <button
        type="button"
        onClick={onBack}
        className="w-10 h-10 rounded-full flex items-center justify-center text-[#E5E5EA] hover:bg-white/10 active:scale-95 transition-all"
        aria-label="Back"
      >
        <ArrowLeft className="w-5 h-5 stroke-[2]" />
      </button>

      {/* Title */}
      <h1 className="text-[15px] font-semibold text-white tracking-tight">
        Now Playing
      </h1>

      {/* Info Button */}
      <button
        type="button"
        onClick={onInfoClick}
        className="w-10 h-10 rounded-full flex items-center justify-center text-[#E5E5EA] hover:bg-white/10 active:scale-95 transition-all"
        aria-label="Track Information"
      >
        <Info className="w-5 h-5 stroke-[2]" />
      </button>
    </div>
  );
}
