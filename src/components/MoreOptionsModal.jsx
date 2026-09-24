import React, { useState } from 'react';
import { X, Sliders, Moon, Share2, Sparkles, Check } from 'lucide-react';

export default function MoreOptionsModal({
  isOpen,
  onClose,
  song,
  onToast
}) {
  const [equalizerPreset, setEqualizerPreset] = useState('Studio Balanced');
  const [sleepTimer, setSleepTimer] = useState('Off');

  if (!isOpen) return null;

  const presets = ['Studio Balanced', 'Bass Boost', 'Vocal Clarity', 'Acoustic Warm'];
  const timers = ['Off', '15 mins', '30 mins', '45 mins', '1 hour'];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: song.title,
        text: `Listening to ${song.title} by ${song.artist} on Audio Player!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      if (onToast) onToast('Link copied to clipboard!');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#1C1D21] border border-[#2E3036] rounded-t-[32px] sm:rounded-[32px] p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90dvh] overflow-y-auto no-scrollbar">

        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <h3 className="text-base font-bold text-white tracking-tight">
            Audio Settings & Options
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

        {/* Equalizer Profile */}
        <div>
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-white">
            <Sliders className="w-4 h-4 text-blue-400" />
            <span>Equalizer Preset</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {presets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setEqualizerPreset(preset);
                  if (onToast) onToast(`EQ set to ${preset}`);
                }}
                className={`py-2 px-3 rounded-xl text-[11px] font-medium transition-all text-left flex items-center justify-between border ${
                  equalizerPreset === preset
                    ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                    : 'bg-[#222328] border-transparent text-[#8E8E93] hover:text-white'
                }`}
              >
                <span>{preset}</span>
                {equalizerPreset === preset && <Check className="w-3.5 h-3.5 text-blue-400" />}
              </button>
            ))}
          </div>
        </div>

        {/* Sleep Timer */}
        <div>
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-white">
            <Moon className="w-4 h-4 text-purple-400" />
            <span>Sleep Timer</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {timers.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setSleepTimer(t);
                  if (onToast) onToast(t === 'Off' ? 'Sleep timer cancelled' : `Sleep timer set for ${t}`);
                }}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-medium whitespace-nowrap transition-all border ${
                  sleepTimer === t
                    ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                    : 'bg-[#222328] border-transparent text-[#8E8E93] hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Share Song */}
        <button
          type="button"
          onClick={handleShare}
          className="w-full py-3 bg-[#24252B] hover:bg-[#2C2D34] rounded-2xl text-xs font-bold text-white flex items-center justify-center gap-2 border border-white/5 transition-all active:scale-98"
        >
          <Share2 className="w-4 h-4 text-emerald-400" />
          <span>Share Song Link</span>
        </button>

      </div>
    </div>
  );
}
