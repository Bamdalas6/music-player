import { DEFAULT_PLAYLIST } from '../data/songs.js';

/**
 * Clean voice text query by stripping common intent prefixes
 */
export function cleanVoiceQuery(transcript) {
  if (!transcript) return '';
  let query = transcript.toLowerCase().trim();

  // Strip prefixes
  const prefixes = [
    'can you play',
    'please play',
    'play me',
    'i want to listen to',
    'i want to hear',
    'put on',
    'search for',
    'find me',
    'switch to',
    'play'
  ];

  for (const prefix of prefixes) {
    if (query.startsWith(prefix)) {
      query = query.slice(prefix.length).trim();
      break;
    }
  }

  // Strip punctuation
  query = query.replace(/[.,?!]/g, '').trim();
  return query;
}

/**
 * Search the song catalog based on voice query
 */
export function findSongByVoiceQuery(rawTranscript, playlist = DEFAULT_PLAYLIST) {
  const query = cleanVoiceQuery(rawTranscript);
  if (!query) return playlist[0];

  const lowerQuery = query.toLowerCase();

  // 1. Direct exact or substring title match
  const exactTitle = playlist.find(s => s.title.toLowerCase() === lowerQuery || s.title.toLowerCase().includes(lowerQuery));
  if (exactTitle) return exactTitle;

  // 2. Direct exact or substring artist match
  const exactArtist = playlist.find(s => s.artist.toLowerCase() === lowerQuery || s.artist.toLowerCase().includes(lowerQuery));
  if (exactArtist) return exactArtist;

  // 3. Relevance scoring based on token overlap across genre, moods, title and artist
  const tokens = lowerQuery.split(/\s+/).filter(t => t.length > 2);
  let bestSong = null;
  let maxScore = 0;

  for (const song of playlist) {
    let score = 0;
    const titleLower = song.title.toLowerCase();
    const artistLower = song.artist.toLowerCase();
    const genreLower = song.genre.toLowerCase();
    const moodsLower = (song.moods || []).map(m => m.toLowerCase());

    for (const token of tokens) {
      if (titleLower.includes(token)) score += 5;
      if (artistLower.includes(token)) score += 4;
      if (genreLower.includes(token)) score += 3;
      if (moodsLower.some(m => m.includes(token) || token.includes(m))) score += 2;
    }

    if (score > maxScore) {
      maxScore = score;
      bestSong = song;
    }
  }

  if (bestSong && maxScore > 0) return bestSong;

  return playlist[0];
}

/**
 * Speech Recognition Wrapper
 */
export class VoiceRecognitionService {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.isSupported = false;

    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
        this.isSupported = true;
      }
    }
  }

  startListening({ onResult, onInterim, onError, onEnd }) {
    if (!this.isSupported || !this.recognition) {
      if (onError) onError(new Error('Speech recognition not supported in this browser'));
      return false;
    }

    try {
      this.recognition.onstart = () => {
        this.isListening = true;
      };

      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (interimTranscript && onInterim) {
          onInterim(interimTranscript);
        }

        if (finalTranscript && onResult) {
          onResult(finalTranscript);
        }
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;
        if (onError) onError(event);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (onEnd) onEnd();
      };

      this.recognition.start();
      return true;
    } catch (err) {
      if (onError) onError(err);
      return false;
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
      this.isListening = false;
    }
  }
}
