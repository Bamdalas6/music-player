import React from 'react';
import { ArrowLeft, Info } from 'lucide-react';

export default function TopBar({ onBack, onInfoClick }) {
  return (
    <div className="flex items-center justify-between px-4 sm:px-6 pt-1 pb-1 sm:pt-2 sm:pb-2 shrink-0">
      {/* Back Button */}
      <button
        type="button"
        onClick={onBack}
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-[#E5E5EA] hover:bg-white/10 active:scale-95 transition-all"
        aria-label="Back"
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
      </button>

      {/* Title */}
      <h1 className="text-sm sm:text-[15px] font-semibold text-white tracking-tight">
        Now Playing
      </h1>

      {/* Info Button */}
      <button
        type="button"
        onClick={onInfoClick}
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-[#E5E5EA] hover:bg-white/10 active:scale-95 transition-all"
        aria-label="Track Information"
      >
        <Info className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
      </button>
    </div>
  );
}
