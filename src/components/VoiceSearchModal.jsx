import React, { useState, useEffect } from 'react';
import { Mic, X, Search, Sparkles, Volume2 } from 'lucide-react';
import { VOICE_SUGGESTIONS } from '../data/songs';

export default function VoiceSearchModal({
  isOpen,
  onClose,
  transcript,
  isListening,
  onPerformSearch,
  matchedSong
}) {
  const [manualQuery, setManualQuery] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setManualQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (manualQuery.trim()) {
      onPerformSearch(manualQuery.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#1E1F24] border border-[#2E3036] rounded-[32px] p-6 shadow-2xl relative overflow-hidden">

        {/* Ambient Top Glow */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-[#8E8E93] hover:text-white flex items-center justify-center transition-all"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center pt-2 pb-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-3 relative">
            {isListening && (
              <span className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping opacity-60" />
            )}
            <Mic className={`w-8 h-8 ${isListening ? 'text-blue-400 animate-pulse' : 'text-white'}`} />
          </div>

          <h3 className="text-lg font-bold text-white tracking-tight">
            {isListening ? "Listening for your song..." : "Voice Audio Search"}
          </h3>
          <p className="text-xs text-[#8E8E93] mt-1 max-w-[240px] mx-auto">
            Say the genre, mood, artist, or song title you want to hear.
          </p>
        </div>

        {/* Live Transcript / Feedback */}
        <div className="min-h-[50px] bg-[#161719] rounded-2xl p-3.5 border border-white/5 flex items-center justify-center text-center mb-4">
          {transcript ? (
            <p className="text-sm font-semibold text-blue-300 italic">
              "{transcript}"
            </p>
          ) : isListening ? (
            <div className="flex items-center gap-1.5 text-xs text-[#8E8E93]">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:300ms]" />
              <span className="ml-1">Speak into your microphone</span>
            </div>
          ) : (
            <p className="text-xs text-[#8E8E93]">
              Tap a voice prompt below or type your request
            </p>
          )}
        </div>

        {/* Matched Confirmation */}
        {matchedSong && (
          <div className="mb-4 p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl flex items-center gap-3 animate-in fade-in">
            <img
              src={matchedSong.cover}
              alt={matchedSong.title}
              className="w-10 h-10 rounded-xl object-cover"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                Found & Playing
              </span>
              <p className="text-xs font-bold text-white truncate">
                {matchedSong.title}
              </p>
              <p className="text-[11px] text-[#8E8E93] truncate">
                {matchedSong.artist}
              </p>
            </div>
          </div>
        )}

        {/* Quick Voice Suggestion Chips */}
        <div className="space-y-1.5 mb-4">
          <span className="text-[11px] font-semibold text-[#8E8E93] block">
            Suggested Prompts:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {VOICE_SUGGESTIONS.slice(0, 6).map((suggestion, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onPerformSearch(suggestion)}
                className="px-2.5 py-1 rounded-full bg-[#27282D] hover:bg-[#34353B] text-white text-[11px] font-medium transition-all active:scale-95 border border-white/5"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Text Input Fallback */}
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={manualQuery}
            onChange={(e) => setManualQuery(e.target.value)}
            placeholder="Or type song or genre (e.g. Jazz)..."
            className="w-full bg-[#161719] border border-white/10 rounded-xl pl-9 pr-14 py-2.5 text-xs text-white placeholder-[#8E8E93] focus:outline-none focus:border-blue-500 transition-colors"
          />
          <Search className="w-3.5 h-3.5 text-[#8E8E93] absolute left-3 pointer-events-none" />
          <button
            type="submit"
            className="absolute right-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold rounded-lg transition-all"
          >
            Play
          </button>
        </form>

      </div>
    </div>
  );
}
