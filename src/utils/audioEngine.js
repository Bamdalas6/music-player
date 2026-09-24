class AudioEngine {
  constructor() {
    this.audio = null;
    this.audioContext = null;
    this.analyser = null;
    this.gainNode = null;
    this.isMuted = false;
    this.volume = 0.8;
    this.synthInterval = null;
    this.synthActive = false;
    this.currentSong = null;
    this.isPlaying = false;
    this.isPausedByUser = false;
    this.currentTime = 0;
    this.duration = 0;

    this.onTimeUpdate = null;
    this.onEnded = null;
    this.onStatusChange = null;
    this.onError = null;
  }

  initContext() {
    if (!this.audioContext && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioContext = new AudioCtx();
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 64;
        this.gainNode = this.audioContext.createGain();
        this.gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
        this.gainNode.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
      }
    }
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume().catch(() => {});
    }
  }

  getOrCreateAudio() {
    if (!this.audio && typeof window !== 'undefined') {
      this.audio = new Audio();
      this.audio.preload = 'auto';
    }
    return this.audio;
  }

  unlockAudio() {
    this.initContext();
    if (typeof window !== 'undefined') {
      const audio = this.getOrCreateAudio();
      if (audio && audio.paused && !this.isPlaying) {
        try {
          const silentWav = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
          if (!audio.src) {
            audio.src = silentWav;
            const p = audio.play();
            if (p !== undefined) {
              p.then(() => audio.pause()).catch(() => {});
            }
          }
        } catch (e) {
          // Ignore priming errors
        }
      }
    }
  }

  playSong(song) {
    this.isPausedByUser = false;
    this.stopSynth();
    this.currentSong = song;
    this.currentTime = 0;
    this.duration = song.duration || 180;
    this.isPlaying = true;

    const audio = this.getOrCreateAudio();
    if (!audio) return;

    // Reset event handlers on the reusable audio element
    audio.onended = null;
    audio.onerror = null;
    audio.ontimeupdate = null;
    try {
      audio.pause();
    } catch (e) {}

    // CRITICAL: Do NOT set anonymous CORS mode on this.audio.
    // iTunes / Apple CDN audio preview URLs do not consistently return Access-Control-Allow-Origin headers.
    // Omitting cross-origin attribute allows the browser to play external audio streams via standard HTML5 no-cors mode.
    audio.removeAttribute('crossOrigin');
    audio.preload = 'auto';
    try {
      audio.referrerPolicy = 'no-referrer';
    } catch (e) {}
    audio.src = song.audioUrl;
    audio.volume = this.isMuted ? 0 : this.volume;
    try {
      audio.load();
    } catch (e) {}

    let fallbackAttempted = false;

    // Attach clean HTML5 audio events
    audio.ontimeupdate = () => {
      if (this.isPausedByUser) return;
      this.currentTime = audio.currentTime;
      if (audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
        this.duration = audio.duration;
      }
      if (this.onTimeUpdate) {
        this.onTimeUpdate(this.currentTime, this.duration);
      }
    };

    audio.onended = () => {
      // If user paused or interrupted, ignore ended event
      if (this.isPausedByUser || !this.isPlaying) return;
      this.isPlaying = false;
      if (this.onStatusChange) this.onStatusChange({ isPlaying: false, isSynth: false });
      if (this.onEnded) this.onEnded();
    };

    audio.onerror = () => {
      // If user stopped or changed song, do not trigger fallback or next
      if (this.isPausedByUser || !this.isPlaying) return;

      if (!fallbackAttempted && song.audioFallbackUrl && song.audioFallbackUrl !== audio.src) {
        fallbackAttempted = true;
        console.warn('Primary audio stream failed, attempting fallback URL:', song.audioFallbackUrl);
        audio.src = song.audioFallbackUrl;
        try {
          audio.load();
        } catch (e) {}
        const fallbackPromise = audio.play();
        if (fallbackPromise !== undefined) {
          fallbackPromise.catch(() => {
            this.startSynth(song);
          });
        }
        return;
      }

      console.warn('Network audio stream unavailable, using audio synthesizer fallback.');
      this.startSynth(song);
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          if (this.isPausedByUser) {
            // User paused while play was resolving
            audio.pause();
            this.isPlaying = false;
            if (this.onStatusChange) this.onStatusChange({ isPlaying: false, isSynth: false });
            return;
          }
          this.isPlaying = true;
          if (this.onStatusChange) this.onStatusChange({ isPlaying: true, isSynth: false });
        })
        .catch((err) => {
          // If aborted by user pause, do NOT start synth or cascade!
          if (this.isPausedByUser || !this.isPlaying || err.name === 'AbortError') {
            return;
          }
          if (err.name === 'NotAllowedError') {
            // Mobile browser blocked autoplay because of expired user gesture token
            console.warn('Autoplay restricted by browser, awaiting user action.');
            this.isPlaying = false;
            if (this.onStatusChange) this.onStatusChange({ isPlaying: false, isSynth: false });

            // Attach one-time listener so the next touch anywhere starts audio
            const unlockAndPlay = () => {
              window.removeEventListener('click', unlockAndPlay, true);
              window.removeEventListener('touchstart', unlockAndPlay, true);
              if (this.audio && !this.isPausedByUser && song === this.currentSong) {
                this.audio.play().then(() => {
                  this.isPlaying = true;
                  if (this.onStatusChange) this.onStatusChange({ isPlaying: true, isSynth: false });
                }).catch(() => {});
              }
            };
            window.addEventListener('click', unlockAndPlay, { once: true, capture: true });
            window.addEventListener('touchstart', unlockAndPlay, { once: true, capture: true });
            return;
          }

          if (!fallbackAttempted && song.audioFallbackUrl && song.audioFallbackUrl !== audio.src) {
            fallbackAttempted = true;
            audio.src = song.audioFallbackUrl;
            try {
              audio.load();
            } catch (e) {}
            audio.play().catch(() => {
              this.startSynth(song);
            });
            return;
          }

          // Only fall back to synth if legitimately blocked and user wants it playing
          this.startSynth(song);
        });
    }
  }

  startSynth(song) {
    if (this.isPausedByUser) return;
    this.initContext();
    this.stopSynth();
    this.synthActive = true;
    this.isPlaying = true;
    if (this.onStatusChange) this.onStatusChange({ isPlaying: true, isSynth: true });

    const profile = song.synthProfile || {
      tempo: 90,
      chords: [[261.63, 329.63, 392.00]],
      melody: [392.00, 329.63, 261.63],
      waveform: 'sine'
    };

    let step = 0;
    const intervalMs = Math.round((60 / profile.tempo) * 1000) / 2;

    this.synthInterval = setInterval(() => {
      if (!this.isPlaying || this.isPausedByUser || !this.audioContext) {
        this.stopSynth();
        return;
      }

      this.currentTime += intervalMs / 1000;
      if (this.currentTime >= this.duration) {
        this.stop();
        if (this.onEnded) this.onEnded();
        return;
      }

      if (this.onTimeUpdate) {
        this.onTimeUpdate(this.currentTime, this.duration);
      }

      try {
        const chordIndex = Math.floor(step / 4) % profile.chords.length;
        const melodyIndex = step % profile.melody.length;
        const chord = profile.chords[chordIndex];
        const melodyFreq = profile.melody[melodyIndex];

        if (!this.isMuted && this.volume > 0) {
          this.playTone(melodyFreq, 0.22, profile.waveform || 'sine', 0.12 * this.volume);
          if (step % 2 === 0 && chord) {
            this.playTone(chord[0] / 2, 0.45, 'triangle', 0.18 * this.volume);
          }
        }
      } catch (e) {
        // silent catch
      }

      step++;
    }, intervalMs);
  }

  playTone(freq, duration, type = 'sine', gainVal = 0.1) {
    if (!this.audioContext || this.isMuted || this.isPausedByUser) return;
    try {
      const osc = this.audioContext.createOscillator();
      const toneGain = this.audioContext.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);

      toneGain.gain.setValueAtTime(gainVal, this.audioContext.currentTime);
      toneGain.gain.exponentialRampToValueAtTime(0.0001, this.audioContext.currentTime + duration);

      osc.connect(toneGain);
      toneGain.connect(this.gainNode || this.audioContext.destination);

      osc.start();
      osc.stop(this.audioContext.currentTime + duration);
    } catch (e) {
      // ignore
    }
  }

  stopSynth() {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
    this.synthActive = false;
  }

  pause() {
    this.isPausedByUser = true;
    this.isPlaying = false;
    this.stopSynth();

    if (this.audio) {
      try {
        this.audio.pause();
      } catch (e) {
        // ignore
      }
    }

    if (this.onStatusChange) {
      this.onStatusChange({ isPlaying: false, isSynth: false });
    }
  }

  stop() {
    this.pause();
    this.currentTime = 0;
    if (this.audio) {
      try {
        this.audio.currentTime = 0;
      } catch (e) {
        // ignore
      }
    }
    if (this.onTimeUpdate) {
      this.onTimeUpdate(0, this.duration);
    }
  }

  resume() {
    if (!this.currentSong) return;
    this.isPausedByUser = false;
    this.isPlaying = true;

    if (this.audio && this.audio.src && !this.synthActive) {
      this.audio.play().catch((err) => {
        if (!this.isPausedByUser) {
          this.startSynth(this.currentSong);
        }
      });
    } else {
      this.playSong(this.currentSong);
    }

    if (this.onStatusChange) {
      this.onStatusChange({ isPlaying: true, isSynth: this.synthActive });
    }
  }

  seek(time) {
    this.currentTime = Math.max(0, Math.min(time, this.duration));
    if (this.audio && !this.synthActive) {
      try {
        this.audio.currentTime = this.currentTime;
      } catch (e) {
        // ignore
      }
    }
    if (this.onTimeUpdate) {
      this.onTimeUpdate(this.currentTime, this.duration);
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    this.isMuted = this.volume === 0;
    if (this.audio) {
      this.audio.volume = this.isMuted ? 0 : this.volume;
    }
    if (this.gainNode && this.audioContext) {
      this.gainNode.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.audioContext.currentTime);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.audio) {
      this.audio.volume = this.isMuted ? 0 : this.volume;
    }
    if (this.gainNode && this.audioContext) {
      this.gainNode.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.audioContext.currentTime);
    }
    return this.isMuted;
  }

  getFrequencyData() {
    if (!this.analyser) {
      return new Uint8Array([30, 60, 120, 180, 140, 90, 45, 20]);
    }
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }
}

// Singleton audio engine instance
export const audioEngine = typeof window !== 'undefined' ? new AudioEngine() : null;
export default AudioEngine;
