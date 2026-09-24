'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DEFAULT_PLAYLIST } from '../data/songs';
import { audioEngine } from '../utils/audioEngine';
import { VoiceRecognitionService, findSongByVoiceQuery } from '../utils/speechRecognition';
import { searchOnlineSongs } from '../utils/onlineMusicService';
import TopBar from '../components/TopBar';
import AlbumArtCard from '../components/AlbumArtCard';
import TrackInfoBar from '../components/TrackInfoBar';
import ProgressBar from '../components/ProgressBar';
import CircularController from '../components/CircularController';
import VoiceSearchModal from '../components/VoiceSearchModal';
import QueueDrawer from '../components/QueueDrawer';
import MoreOptionsModal from '../components/MoreOptionsModal';
import LyricsModal from '../components/LyricsModal';
import InfoModal from '../components/InfoModal';
import Toast from '../components/Toast';

export default function AudioPlayerApp() {
  const [playlist, setPlaylist] = useState(DEFAULT_PLAYLIST);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(34);
  const [duration, setDuration] = useState(174);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackMode, setPlaybackMode] = useState('off'); // 'off' (stop at end) | 'repeat-all' | 'repeat-one' | 'shuffle'

  // Modals
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isLyricsOpen, setIsLyricsOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  // Online Search & Voice State
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [isSearchingOnline, setIsSearchingOnline] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [matchedSong, setMatchedSong] = useState(null);

  // Toast
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const currentSong = playlist[currentSongIndex] || playlist[0];
  const voiceServiceRef = useRef(null);
  const playbackModeRef = useRef(playbackMode);

  // Keep ref in sync for event listeners
  useEffect(() => {
    playbackModeRef.current = playbackMode;
  }, [playbackMode]);

  // Initialize AudioEngine callbacks
  useEffect(() => {
    if (!audioEngine) return;

    audioEngine.onTimeUpdate = (curr, dur) => {
      setCurrentTime(curr);
      if (dur && !isNaN(dur) && dur > 0) {
        setDuration(dur);
      }
    };

    audioEngine.onEnded = () => {
      const mode = playbackModeRef.current;
      if (mode === 'repeat-one') {
        // Replay current song cleanly
        audioEngine.seek(0);
        audioEngine.resume();
        showToast('Repeating song');
      } else if (mode === 'repeat-all' || mode === 'shuffle') {
        handleNext();
      } else {
        // Mode is 'off': Cleanly stop! Do NOT play another song!
        setIsPlaying(false);
        audioEngine.stop();
        showToast('Song ended · Stopped');
      }
    };

    audioEngine.onStatusChange = ({ isPlaying: playing }) => {
      setIsPlaying(playing);
    };

    voiceServiceRef.current = new VoiceRecognitionService();

    return () => {
      if (audioEngine) {
        audioEngine.stop();
      }
    };
  }, []);

  // Update duration when song changes
  useEffect(() => {
    if (currentSong) {
      setDuration(currentSong.duration || 180);
    }
  }, [currentSongIndex, currentSong]);

  // Play / Pause / Stop Toggle
  const handleTogglePlay = () => {
    if (!audioEngine) return;
    if (isPlaying) {
      audioEngine.pause();
      setIsPlaying(false);
      showToast('Paused / Stopped ⏸');
    } else {
      audioEngine.resume();
      setIsPlaying(true);
      showToast(`Playing: ${currentSong.title} ▶`);
    }
  };

  const handleNext = () => {
    let nextIndex;
    if (playbackMode === 'shuffle') {
      nextIndex = Math.floor(Math.random() * playlist.length);
    } else if (playbackMode === 'repeat-one') {
      nextIndex = currentSongIndex;
    } else {
      nextIndex = (currentSongIndex + 1) % playlist.length;
    }

    setCurrentSongIndex(nextIndex);
    const nextSong = playlist[nextIndex];
    if (audioEngine) {
      audioEngine.playSong(nextSong);
      setIsPlaying(true);
    }
    showToast(`Next: ${nextSong.title}`);
  };

  const handlePrevious = () => {
    if (currentTime > 4) {
      // Restart current song
      if (audioEngine) audioEngine.seek(0);
      setCurrentTime(0);
      showToast('Restarted track');
      return;
    }

    const prevIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
    setCurrentSongIndex(prevIndex);
    const prevSong = playlist[prevIndex];
    if (audioEngine) {
      audioEngine.playSong(prevSong);
      setIsPlaying(true);
    }
    showToast(`Previous: ${prevSong.title}`);
  };

  const handleSeek = (newTime) => {
    setCurrentTime(newTime);
    if (audioEngine) {
      audioEngine.seek(newTime);
    }
  };

  const handleToggleMute = () => {
    if (!audioEngine) {
      setIsMuted(!isMuted);
      return;
    }
    const muted = audioEngine.toggleMute();
    setIsMuted(muted);
    showToast(muted ? 'Audio Silenced / Muted 🔇' : 'Audio Unmuted 🔊');
  };

  const handleToggleLike = () => {
    const updated = [...playlist];
    const newLiked = !currentSong.isLiked;
    updated[currentSongIndex] = { ...currentSong, isLiked: newLiked };
    setPlaylist(updated);
    showToast(newLiked ? `Added "${currentSong.title}" to Liked Songs ❤️` : `Removed from Liked Songs`);
  };

  const handleToggleFollow = () => {
    const updated = [...playlist];
    const newFollowed = !currentSong.isFollowed;
    updated[currentSongIndex] = { ...currentSong, isFollowed: newFollowed };
    setPlaylist(updated);
    showToast(newFollowed ? `Following ${currentSong.artist} ✓` : `Unfollowed ${currentSong.artist}`);
  };

  const handleTogglePlaybackMode = () => {
    const modes = ['off', 'repeat-all', 'repeat-one', 'shuffle'];
    const nextMode = modes[(modes.indexOf(playbackMode) + 1) % modes.length];
    setPlaybackMode(nextMode);

    const labels = {
      'off': 'Autoplay Off (Stop at end)',
      'repeat-all': 'Repeat All Songs',
      'repeat-one': 'Repeat Current Song',
      'shuffle': 'Shuffle All Songs'
    };
    showToast(labels[nextMode] || nextMode);
  };

  // Play a song from search results
  const playSelectedSong = (song) => {
    if (audioEngine) {
      audioEngine.stop();
    }
    setPlaylist((prev) => {
      const exists = prev.findIndex((s) => s.id === song.id);
      if (exists !== -1) {
        setCurrentSongIndex(exists);
        return prev;
      }
      return [song, ...prev];
    });
    setCurrentSongIndex(0);

    if (audioEngine) {
      audioEngine.playSong(song);
      setIsPlaying(true);
    }

    showToast(`Now Playing: "${song.title}" by ${song.artist}`);
    setIsVoiceModalOpen(false);
  };

  // Perform Online Real-Time Search & Automatic Playback
  const performVoiceSearch = async (queryText) => {
    if (!queryText || !queryText.trim()) return;

    setVoiceTranscript(queryText);
    setIsSearchingOnline(true);
    showToast(`Searching online for "${queryText}"... 🔍`);

    try {
      // 1. Search global online music catalog (Afrobeats, Amapiano, International, etc.)
      const onlineResults = await searchOnlineSongs(queryText, 8);

      if (onlineResults && onlineResults.length > 0) {
        setSearchResults(onlineResults);
        const topSong = onlineResults[0];
        setMatchedSong(topSong);

        // Stop previous audio completely before loading new song
        if (audioEngine) {
          audioEngine.stop();
        }

        // Prepend to active playlist
        setPlaylist((prev) => {
          const filtered = prev.filter((s) => s.id !== topSong.id);
          return [topSong, ...filtered];
        });
        setCurrentSongIndex(0);

        // Start playback on screen
        if (audioEngine) {
          audioEngine.playSong(topSong);
          setIsPlaying(true);
        }

        showToast(`Playing online: "${topSong.title}" by ${topSong.artist}! 🎶`);

        setTimeout(() => {
          setIsVoiceModalOpen(false);
          setIsVoiceListening(false);
          setMatchedSong(null);
        }, 1200);
      } else {
        // Fallback to local catalog
        const localMatch = findSongByVoiceQuery(queryText, playlist);
        if (localMatch) {
          if (audioEngine) audioEngine.stop();
          const songIdx = playlist.findIndex((s) => s.id === localMatch.id);
          if (songIdx !== -1) {
            setCurrentSongIndex(songIdx);
          }
          if (audioEngine) {
            audioEngine.playSong(localMatch);
            setIsPlaying(true);
          }
          showToast(`Playing: "${localMatch.title}"`);
        } else {
          showToast(`No online or local match for "${queryText}".`);
        }
        setIsVoiceModalOpen(false);
      }
    } catch (err) {
      console.error('Error during online song search:', err);
      showToast(`Search error. Playing closest match.`);
    } finally {
      setIsSearchingOnline(false);
      setIsVoiceListening(false);
    }
  };

  const handleStartVoiceSearch = () => {
    setIsVoiceModalOpen(true);
    setVoiceTranscript('');
    setMatchedSong(null);
    setSearchResults([]);

    if (!voiceServiceRef.current || !voiceServiceRef.current.isSupported) {
      setIsVoiceListening(false);
      return;
    }

    setIsVoiceListening(true);
    voiceServiceRef.current.startListening({
      onInterim: (interim) => {
        setVoiceTranscript(interim);
      },
      onResult: (final) => {
        setVoiceTranscript(final);
        performVoiceSearch(final);
      },
      onError: (err) => {
        console.warn('Voice recognition error or denied:', err);
        setIsVoiceListening(false);
      },
      onEnd: () => {
        setIsVoiceListening(false);
      }
    });
  };

  return (
    <main className="min-h-screen bg-[#111214] flex justify-center text-white antialiased selection:bg-blue-500 selection:text-white">
      {/* Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Main Responsive Music Player Container */}
      <div className="w-full max-w-md min-h-screen bg-[#161719] flex flex-col justify-between py-2 sm:px-2 shadow-2xl relative overflow-hidden sm:my-4 sm:rounded-[36px] sm:border sm:border-white/5">

        {/* Top Navigation */}
        <TopBar
          onBack={() => setIsQueueOpen(true)}
          onInfoClick={() => setIsInfoOpen(true)}
        />

        {/* Album Artwork Card */}
        <AlbumArtCard
          song={currentSong}
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
        />

        {/* Track Title, Artist, & Follow Pill */}
        <TrackInfoBar
          song={currentSong}
          isPlaying={isPlaying}
          isFollowed={currentSong.isFollowed}
          onToggleFollow={handleToggleFollow}
          onThumbnailClick={() => setIsLyricsOpen(true)}
        />

        {/* Interactive Scrub Bar & Timestamps */}
        <ProgressBar
          currentTime={currentTime}
          duration={duration}
          onSeek={handleSeek}
        />

        {/* Iconic Circular Controller with Center Microphone & Satellites */}
        <CircularController
          isLiked={currentSong.isLiked}
          onToggleLike={handleToggleLike}
          onPrevious={handlePrevious}
          onNext={handleNext}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          isVoiceListening={isVoiceListening}
          onStartVoiceSearch={handleStartVoiceSearch}
          onOpenMore={() => setIsMoreOpen(true)}
          onOpenQueue={() => setIsQueueOpen(true)}
          playbackMode={playbackMode}
          onTogglePlaybackMode={handleTogglePlaybackMode}
          onOpenLyrics={() => setIsLyricsOpen(true)}
          isPlaying={isPlaying}
          onTogglePlayPause={handleTogglePlay}
        />

        {/* Modals & Drawers */}
        <VoiceSearchModal
          isOpen={isVoiceModalOpen}
          onClose={() => {
            setIsVoiceModalOpen(false);
            setIsVoiceListening(false);
            if (voiceServiceRef.current) voiceServiceRef.current.stopListening();
          }}
          transcript={voiceTranscript}
          isListening={isVoiceListening}
          isSearchingOnline={isSearchingOnline}
          searchResults={searchResults}
          onPerformSearch={performVoiceSearch}
          onSelectSong={playSelectedSong}
          matchedSong={matchedSong}
        />

        <QueueDrawer
          isOpen={isQueueOpen}
          onClose={() => setIsQueueOpen(false)}
          playlist={playlist}
          currentSong={currentSong}
          onSelectSong={(song) => {
            const idx = playlist.findIndex((s) => s.id === song.id);
            if (idx !== -1) {
              setCurrentSongIndex(idx);
              if (audioEngine) {
                audioEngine.playSong(song);
                setIsPlaying(true);
              }
              showToast(`Now Playing: ${song.title}`);
            }
          }}
          isPlaying={isPlaying}
        />

        <MoreOptionsModal
          isOpen={isMoreOpen}
          onClose={() => setIsMoreOpen(false)}
          song={currentSong}
          onToast={showToast}
        />

        <LyricsModal
          isOpen={isLyricsOpen}
          onClose={() => setIsLyricsOpen(false)}
          song={currentSong}
          currentTime={currentTime}
          isPlaying={isPlaying}
        />

        <InfoModal
          isOpen={isInfoOpen}
          onClose={() => setIsInfoOpen(false)}
          song={currentSong}
        />
      </div>
    </main>
  );
}
