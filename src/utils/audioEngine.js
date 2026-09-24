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
    this.currentTime = 0;
    this.duration = 0;

    this.onTimeUpdate = null;
    this.onEnded = null;
    this.onStatusChange = null;
    this.onError = null;
  }

  initContext() {
    if (!this.audioContext) {
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
      this.audioContext.resume();
    }
  }

  playSong(song) {
    this.initContext();
    this.stopSynth();
    this.currentSong = song;
    this.currentTime = 0;
    this.duration = song.duration || 180;

    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
    }

    this.audio = new Audio();
    this.audio.crossOrigin = 'anonymous';
    this.audio.src = song.audioUrl;
    this.audio.volume = this.isMuted ? 0 : this.volume;

    // Attach HTML5 audio events
    this.audio.addEventListener('timeupdate', () => {
      this.currentTime = this.audio.currentTime;
      if (this.audio.duration && !isNaN(this.audio.duration)) {
        this.duration = this.audio.duration;
      }
      if (this.onTimeUpdate) {
        this.onTimeUpdate(this.currentTime, this.duration);
      }
    });

    this.audio.addEventListener('ended', () => {
      this.isPlaying = false;
      if (this.onEnded) this.onEnded();
    });

    this.audio.addEventListener('error', (err) => {
      console.warn('Network audio stream blocked or failed, falling back to Web Audio Synthesizer Engine:', err);
      this.startSynth(song);
    });

    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.isPlaying = true;
          if (this.onStatusChange) this.onStatusChange({ isPlaying: true, isSynth: false });
        })
        .catch(() => {
          // Autoplay or CORS restriction - switch to procedural Web Audio Synth
          this.startSynth(song);
        });
    }
  }

  startSynth(song) {
    this.initContext();
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
      if (!this.isPlaying || !this.audioContext) return;

      this.currentTime += intervalMs / 1000;
      if (this.currentTime >= this.duration) {
        this.currentTime = 0;
        if (this.onEnded) this.onEnded();
        return;
      }

      if (this.onTimeUpdate) {
        this.onTimeUpdate(this.currentTime, this.duration);
      }

      // Play soft chord / melody notes
      try {
        const chordIndex = Math.floor(step / 4) % profile.chords.length;
        const melodyIndex = step % profile.melody.length;
        const chord = profile.chords[chordIndex];
        const melodyFreq = profile.melody[melodyIndex];

        if (!this.isMuted && this.volume > 0) {
          // Play melody tone
          this.playTone(melodyFreq, 0.22, profile.waveform || 'sine', 0.12 * this.volume);

          // Play bass / chord root on downbeats
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
    if (!this.audioContext || this.isMuted) return;
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
    this.isPlaying = false;
    if (this.audio) {
      this.audio.pause();
    }
    if (this.synthActive) {
      // Pause synth timer
      if (this.synthInterval) clearInterval(this.synthInterval);
    }
    if (this.onStatusChange) this.onStatusChange({ isPlaying: false, isSynth: this.synthActive });
  }

  resume() {
    this.initContext();
    this.isPlaying = true;
    if (this.synthActive && this.currentSong) {
      this.startSynth(this.currentSong);
    } else if (this.audio) {
      this.audio.play().catch(() => {
        if (this.currentSong) this.startSynth(this.currentSong);
      });
    }
    if (this.onStatusChange) this.onStatusChange({ isPlaying: true, isSynth: this.synthActive });
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
    if (this.volume === 0) {
      this.isMuted = true;
    } else {
      this.isMuted = false;
    }
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
      // Return simulated rhythmic wave if analyser not connected
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
