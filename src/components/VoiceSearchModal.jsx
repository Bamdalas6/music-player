import React, { useState, useEffect } from 'react';
import { Mic, X, Search, Sparkles, Loader2, Play, Globe } from 'lucide-react';

const SUGGESTED_QUERIES = [
  "Burna Boy - City Boys",
  "Asake - Lonely At The Top",
  "Rema - Calm Down",
  "Wizkid - Essence",
  "The Weeknd - Blinding Lights",
  "Taylor Swift - Cruel Summer",
  "Sunday Morning",
  "Michael Jackson - Billie Jean"
];

export default function VoiceSearchModal({
  isOpen,
  onClose,
  transcript,
  isListening,
  isSearchingOnline,
  searchResults = [],
  onPerformSearch,
  onSelectSong,
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#1E1F24] border border-[#2E3036] rounded-t-[32px] sm:rounded-[32px] p-5 sm:p-6 shadow-2xl relative max-h-[90dvh] flex flex-col overflow-hidden">

        {/* Top Gradient Line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-[#8E8E93] hover:text-white flex items-center justify-center transition-all z-10"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center pt-1 pb-3 shrink-0">
          <div className="w-14 h-14 mx-auto rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-2.5 relative">
            {isListening && (
              <span className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping opacity-60" />
            )}
            <Mic className={`w-7 h-7 ${isListening ? 'text-blue-400 animate-pulse' : 'text-white'}`} />
          </div>

          <h3 className="text-base font-bold text-white tracking-tight flex items-center justify-center gap-1.5">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Search Any Song Online</span>
          </h3>
          <p className="text-[11px] text-[#8E8E93] mt-0.5 max-w-[260px] mx-auto">
            Say or type any African or International song to search & play immediately.
          </p>
        </div>

        {/* Text Input */}
        <form onSubmit={handleSubmit} className="relative flex items-center mb-3 shrink-0">
          <input
            type="text"
            value={manualQuery}
            onChange={(e) => setManualQuery(e.target.value)}
            placeholder="e.g. Burna Boy, Asake, The Weeknd..."
            className="w-full bg-[#161719] border border-white/10 rounded-2xl pl-9 pr-16 py-3 text-xs text-white placeholder-[#8E8E93] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
          />
          <Search className="w-4 h-4 text-[#8E8E93] absolute left-3 pointer-events-none" />
          <button
            type="submit"
            disabled={!manualQuery.trim() || isSearchingOnline}
            className="absolute right-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all active:scale-95"
          >
            {isSearchingOnline ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              'Play'
            )}
          </button>
        </form>

        {/* Live Status / Speech Feedback */}
        <div className="bg-[#161719] rounded-2xl p-2.5 border border-white/5 flex items-center justify-center text-center mb-3 shrink-0">
          {isSearchingOnline ? (
            <div className="flex items-center gap-2 text-xs text-blue-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Searching worldwide catalog for "{transcript || manualQuery}"...</span>
            </div>
          ) : transcript ? (
            <p className="text-xs font-semibold text-blue-300 italic">
              "{transcript}"
            </p>
          ) : isListening ? (
            <div className="flex items-center gap-1.5 text-xs text-[#8E8E93]">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:300ms]" />
              <span className="ml-1 text-white">Listening... say any song or artist</span>
            </div>
          ) : (
            <p className="text-[11px] text-[#8E8E93]">
              Tap microphone or click any popular hit below
            </p>
          )}
        </div>

        {/* Scrollable Results / Suggestions */}
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
          {/* Online Search Results List */}
          {searchResults.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-emerald-400 tracking-wide uppercase block">
                Online Matches ({searchResults.length})
              </span>
              <div className="space-y-1.5">
                {searchResults.map((song) => (
                  <div
                    key={song.id}
                    onClick={() => onSelectSong(song)}
                    className="flex items-center gap-2.5 p-2 rounded-xl bg-[#25262B] hover:bg-[#2F3036] cursor-pointer transition-all active:scale-[0.99] border border-white/5"
                  >
                    <img
                      src={song.cover}
                      alt={song.title}
                      className="w-10 h-10 rounded-lg object-cover bg-black"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">
                        {song.title}
                      </p>
                      <p className="text-[10px] text-[#8E8E93] truncate">
                        {song.artist} · {song.year}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 hover:bg-emerald-500 hover:text-white transition-colors"
                      aria-label="Play song"
                    >
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick African & International Suggestions */}
          <div>
            <span className="text-[11px] font-semibold text-[#8E8E93] block mb-1.5">
              Popular African & Global Requests:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_QUERIES.map((query, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onPerformSearch(query)}
                  className="px-2.5 py-1 rounded-full bg-[#27282D] hover:bg-[#34353B] text-white text-[11px] font-medium transition-all active:scale-95 border border-white/5 flex items-center gap-1"
                >
                  <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                  <span>{query}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
