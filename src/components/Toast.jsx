import React from 'react';

export default function Toast({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="absolute top-16 inset-x-4 z-50 flex justify-center pointer-events-none animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="px-4 py-2 bg-[#25262B]/95 border border-white/10 backdrop-blur-md rounded-full shadow-2xl text-xs font-semibold text-white flex items-center gap-2 pointer-events-auto">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>{message}</span>
      </div>
    </div>
  );
}
