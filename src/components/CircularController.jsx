import React from 'react';
import {
  Heart,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Mic,
  Play,
  Pause,
  MoreHorizontal,
  ListMusic,
  Repeat,
  Repeat1,
  Shuffle,
  Music2
} from 'lucide-react';

export default function CircularController({
  isLiked,
  onToggleLike,
  onPrevious,
  onNext,
  isMuted,
  onToggleMute,
  isVoiceListening,
  onStartVoiceSearch,
  onOpenMore,
  onOpenQueue,
  playbackMode, // 'off' | 'repeat-all' | 'repeat-one' | 'shuffle'
  onTogglePlaybackMode,
  onOpenLyrics,
  isPlaying,
  onTogglePlayPause
}) {
  return (
    <div className="px-6 pt-1 pb-6 flex flex-col items-center justify-center select-none">

      {/* Voice Prompt Bar above the wheel for instant 1-click voice request */}
      <div className="mb-2">
        <button
          type="button"
          onClick={onStartVoiceSearch}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 active:scale-95 shadow-md border ${
            isVoiceListening
              ? 'bg-blue-600 text-white border-blue-400 animate-pulse'
              : 'bg-[#202126] hover:bg-[#2A2B32] text-blue-400 border-white/10'
          }`}
          aria-label="Search and play any song by voice"
        >
          <Mic className="w-3.5 h-3.5 text-blue-400" />
          <span>{isVoiceListening ? 'Listening...' : 'Voice Search Any Song'}</span>
        </button>
      </div>

      {/* 3x3 Grid / Radial Layout */}
      <div className="relative w-[280px] h-[280px] flex items-center justify-center">

        {/* --- 4 SATELLITE CORNER BUTTONS --- */}

        {/* 1. Top-Left: More Options (•••) */}
        <button
          type="button"
          onClick={onOpenMore}
          className="absolute top-1 left-1 w-12 h-12 rounded-full bg-[#202125] hover:bg-[#2A2B30] text-[#8E8E93] hover:text-white flex items-center justify-center shadow-lg active:scale-90 transition-all duration-200 border border-white/5"
          aria-label="More options"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>

        {/* 2. Top-Right: Queue / Playlist (List icon) */}
        <button
          type="button"
          onClick={onOpenQueue}
          className="absolute top-1 right-1 w-12 h-12 rounded-full bg-[#202125] hover:bg-[#2A2B30] text-[#8E8E93] hover:text-white flex items-center justify-center shadow-lg active:scale-90 transition-all duration-200 border border-white/5"
          aria-label="Playlist Queue"
        >
          <ListMusic className="w-5 h-5" />
        </button>

        {/* 3. Bottom-Left: Repeat / Shuffle / Single Mode Toggle */}
        <button
          type="button"
          onClick={onTogglePlaybackMode}
          className="absolute bottom-1 left-1 w-12 h-12 rounded-full bg-[#202125] hover:bg-[#2A2B30] text-[#8E8E93] hover:text-white flex items-center justify-center shadow-lg active:scale-90 transition-all duration-200 border border-white/5"
          aria-label={`Playback Mode: ${playbackMode}`}
        >
          {playbackMode === 'repeat-one' ? (
            <Repeat1 className="w-5 h-5 text-[#C88D66]" />
          ) : playbackMode === 'shuffle' ? (
            <Shuffle className="w-5 h-5 text-[#C88D66]" />
          ) : playbackMode === 'repeat-all' ? (
            <Repeat className="w-5 h-5 text-blue-400" />
          ) : (
            <Repeat className="w-5 h-5 text-[#636468]" />
          )}
        </button>

        {/* 4. Bottom-Right: Music Note / Lyrics & Visualizer */}
        <button
          type="button"
          onClick={onOpenLyrics}
          className="absolute bottom-1 right-1 w-12 h-12 rounded-full bg-[#202125] hover:bg-[#2A2B30] text-[#8E8E93] hover:text-white flex items-center justify-center shadow-lg active:scale-90 transition-all duration-200 border border-white/5"
          aria-label="Lyrics and Visualizer"
        >
          <Music2 className="w-5 h-5" />
        </button>

        {/* --- MAIN CIRCULAR D-PAD CONTROLLER WHEEL --- */}
        <div className="relative w-[210px] h-[210px] rounded-full bg-[#222327] shadow-wheel border border-white/[0.07] flex items-center justify-center p-2">

          {/* TOP: Heart / Like Button */}
          <button
            type="button"
            onClick={onToggleLike}
            className="absolute top-2 w-12 h-12 flex items-center justify-center text-[#8E8E93] hover:text-white active:scale-90 transition-all"
            aria-label={isLiked ? "Unlike song" : "Like song"}
          >
            <Heart
              className={`w-5 h-5 transition-transform duration-200 ${
                isLiked
                  ? 'fill-rose-500 text-rose-500 scale-110'
                  : 'text-[#8E8E93] hover:text-white'
              }`}
            />
          </button>

          {/* LEFT: Previous Track (|◀◀) */}
          <button
            type="button"
            onClick={onPrevious}
            className="absolute left-2 w-12 h-12 flex items-center justify-center text-[#E5E5EA] hover:text-white active:scale-90 transition-all"
            aria-label="Previous track"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>

          {/* RIGHT: Next Track (▶▶|) */}
          <button
            type="button"
            onClick={onNext}
            className="absolute right-2 w-12 h-12 flex items-center justify-center text-[#E5E5EA] hover:text-white active:scale-90 transition-all"
            aria-label="Next track"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>

          {/* BOTTOM: Silent / Mute Toggle */}
          <button
            type="button"
            onClick={onToggleMute}
            className="absolute bottom-2 w-12 h-12 flex items-center justify-center text-[#8E8E93] hover:text-white active:scale-90 transition-all"
            aria-label={isMuted ? "Unmute audio" : "Mute / Silent audio"}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-rose-400" />
            ) : (
              <Volume2 className="w-5 h-5 text-[#8E8E93] hover:text-white" />
            )}
          </button>

          {/* CENTER: Dual Play/Pause/Stop and Voice Microphone */}
          <div className="relative">
            {isVoiceListening && (
              <>
                <span className="absolute -inset-2 rounded-full bg-blue-500/30 animate-ping" />
                <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-75 blur-xs" />
              </>
            )}

            <button
              type="button"
              onClick={onTogglePlayPause}
              className={`relative w-18 h-18 rounded-full flex flex-col items-center justify-center shadow-wheel-inner transition-all duration-200 active:scale-95 border ${
                isPlaying
                  ? 'bg-[#1D1E22] hover:bg-[#25262B] text-white border-emerald-500/40'
                  : 'bg-[#18191C] hover:bg-[#202126] text-white border-white/10'
              }`}
              aria-label={isPlaying ? "Stop or Pause Song" : "Play Song"}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-current text-white transition-transform active:scale-90" />
              ) : (
                <Play className="w-6 h-6 fill-current text-white ml-0.5 transition-transform active:scale-90" />
              )}
              <span className={`text-[8px] font-bold uppercase tracking-wider mt-0.5 ${isPlaying ? 'text-emerald-400' : 'text-[#8E8E93]'}`}>
                {isPlaying ? 'PAUSE' : 'PLAY'}
              </span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
