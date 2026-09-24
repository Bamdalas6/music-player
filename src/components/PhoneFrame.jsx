import React from 'react';
import { Wifi, Battery } from 'lucide-react';

export default function PhoneFrame({ children, isFrameEnabled, onToggleFrame }) {
  if (!isFrameEnabled) {
    return (
      <div className="min-h-screen bg-[#141517] flex justify-center text-white antialiased">
        <div className="w-full max-w-md min-h-screen bg-[#161719] flex flex-col relative overflow-hidden">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0E10] flex flex-col items-center justify-center p-2 sm:p-6 text-white select-none">

      {/* Frame Mode Toggle Bar at Top of Browser */}
      <div className="mb-4 flex items-center gap-3">
        <span className="text-xs font-semibold text-[#8E8E93]">
          Mockup View:
        </span>
        <button
          type="button"
          onClick={onToggleFrame}
          className="px-3 py-1 bg-[#1F2024] hover:bg-[#2B2C32] rounded-full text-xs font-bold text-white border border-white/10 transition-all"
        >
          {isFrameEnabled ? "📱 Device Frame (Active)" : "💻 Full Screen Mode"}
        </button>
      </div>

      {/* Titanium Copper iPhone Shell */}
      <div className="relative w-full max-w-[390px] aspect-[9/19.5] max-h-[844px] rounded-[52px] bg-[#161719] border-[10px] border-[#A86E47] shadow-[0_30px_90px_rgba(0,0,0,0.8),0_0_0_2px_#3D2517] flex flex-col overflow-hidden">

        {/* Dynamic Island & Status Bar */}
        <div className="relative pt-3 px-7 flex items-center justify-between z-30 shrink-0">
          {/* Time */}
          <span className="text-xs font-bold tracking-tight text-white/90">
            9:41
          </span>

          {/* Dynamic Island Pill */}
          <div className="w-24 h-6 rounded-full bg-black flex items-center justify-between px-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1A1A1A] border border-white/10" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#111] ring-1 ring-blue-500/40" />
          </div>

          {/* Status Icons */}
          <div className="flex items-center gap-1.5 text-white/90">
            <span className="text-[10px] font-bold">5G</span>
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4 fill-white" />
          </div>
        </div>

        {/* Screen Content Container */}
        <div className="flex-1 flex flex-col justify-between overflow-hidden relative">
          {children}
        </div>

        {/* Bottom Home Indicator Bar */}
        <div className="pb-2 pt-1 flex justify-center shrink-0">
          <div className="w-32 h-1 bg-white/40 rounded-full" />
        </div>

      </div>
    </div>
  );
}
