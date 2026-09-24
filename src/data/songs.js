export const DEFAULT_PLAYLIST = [
  {
    id: "song-1",
    title: "Sunday Morning",
    artist: "The Velvet Underground",
    album: "The Velvet Underground & Nico",
    cover: "/album_biplane.png",
    duration: 174, // 2:54
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3",
    audioFallbackUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Erik_Satie_-_Gymnopedie_No._1.ogg",
    genre: "Dream Pop / Indie",
    year: "1967",
    bitrate: "320 kbps (Lossless Flac Audio)",
    isLiked: false,
    isFollowed: false,
    moods: ["relaxing", "calm", "morning", "sunday", "indie", "dream pop", "soft", "peaceful", "aesthetic"],
    lyrics: [
      { time: 0, text: "Sunday morning, brings the dawn in" },
      { time: 6, text: "It's just a restless feeling by my side" },
      { time: 14, text: "Early dawning, Sunday morning" },
      { time: 22, text: "It's all the wasted years so close behind" },
      { time: 30, text: "Watch out, the world's behind you" },
      { time: 38, text: "There's always someone around you who will call" },
      { time: 48, text: "It's nothing at all..." },
      { time: 58, text: "Sunday morning, and I'm falling" },
      { time: 68, text: "I've got a feeling I don't want to know" }
    ],
    synthProfile: {
      tempo: 84,
      chords: [
        [261.63, 329.63, 392.00], // C major
        [220.00, 261.63, 329.63], // A minor
        [174.61, 220.00, 261.63], // F major
        [196.00, 246.94, 293.66], // G major
      ],
      melody: [392.00, 440.00, 392.00, 329.63, 293.66, 261.63],
      waveform: "sine"
    }
  },
  {
    id: "song-2",
    title: "Midnight Horizon",
    artist: "Neon Mirage",
    album: "Outrun 1986",
    cover: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
    duration: 215, // 3:35
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=synthwave-80s-110045.mp3",
    audioFallbackUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c8/Example.ogg",
    genre: "Synthwave / Retrowave",
    year: "2024",
    bitrate: "320 kbps (Lossless Audio)",
    isLiked: true,
    isFollowed: true,
    moods: ["synthwave", "electronic", "drive", "retro", "80s", "neon", "fast", "night", "cyberpunk"],
    lyrics: [
      { time: 0, text: "Cruising down the neon highway" },
      { time: 8, text: "Purple skies and chrome reflections" },
      { time: 16, text: "Midnight horizon calls our name" },
      { time: 24, text: "Speeding through the digital haze" },
      { time: 32, text: "Never look back into the rearview" },
      { time: 42, text: "Synthwave dreams keep shining on" }
    ],
    synthProfile: {
      tempo: 120,
      chords: [
        [130.81, 164.81, 196.00], // C3 synth
        [110.00, 130.81, 164.81], // A2 synth
        [87.31, 110.00, 130.81],  // F2 synth
        [98.00, 123.47, 146.83]   // G2 synth
      ],
      melody: [523.25, 587.33, 659.25, 783.99, 659.25],
      waveform: "sawtooth"
    }
  },
  {
    id: "song-3",
    title: "Autumn Coffee & Rain",
    artist: "Tokyo Lo-Fi Club",
    album: "Chilled Seasons",
    cover: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    duration: 160, // 2:40
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=lofi-chill-medium-version-159456.mp3",
    audioFallbackUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Erik_Satie_-_Gymnopedie_No._1.ogg",
    genre: "Lo-Fi / Chillhop / Jazz",
    year: "2023",
    bitrate: "256 kbps (AAC Hi-Fi)",
    isLiked: false,
    isFollowed: false,
    moods: ["lofi", "chill", "study", "coffee", "jazz", "rain", "relax", "calm", "autumn", "sleep"],
    lyrics: [
      { time: 0, text: "Drops tapping gently against the glass" },
      { time: 10, text: "Steam swirling from a warm porcelain cup" },
      { time: 20, text: "Soft vinyl crackle in the cozy room" },
      { time: 30, text: "Time slowing down with every sip" },
      { time: 42, text: "Just you, the melody, and the rain" }
    ],
    synthProfile: {
      tempo: 75,
      chords: [
        [146.83, 174.61, 220.00, 261.63], // Dm7
        [196.00, 246.94, 293.66, 349.23], // G7
        [130.81, 164.81, 196.00, 246.94], // Cmaj7
        [220.00, 261.63, 329.63, 392.00]  // Am7
      ],
      melody: [349.23, 329.63, 293.66, 261.63],
      waveform: "triangle"
    }
  },
  {
    id: "song-4",
    title: "Golden Sunset Flight",
    artist: "Acoustic Skies",
    album: "High Altitude",
    cover: "/album_biplane.png",
    duration: 198, // 3:18
    audioUrl: "https://cdn.pixabay.com/download/audio/2021/09/06/audio_7323869b59.mp3?filename=acoustic-guitar-ambient-10657.mp3",
    audioFallbackUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Erik_Satie_-_Gymnopedie_No._1.ogg",
    genre: "Acoustic Folk / Ambient",
    year: "2024",
    bitrate: "320 kbps (Lossless)",
    isLiked: true,
    isFollowed: false,
    moods: ["acoustic", "guitar", "sunset", "flight", "plane", "travel", "folk", "golden", "peaceful"],
    lyrics: [
      { time: 0, text: "Wings cutting through the golden light" },
      { time: 9, text: "Far above the canopy of green" },
      { time: 18, text: "Whispers of the propeller humming sweet" },
      { time: 28, text: "Drifting into the evening twilight" },
      { time: 38, text: "We are weightless in the sky" }
    ],
    synthProfile: {
      tempo: 90,
      chords: [
        [196.00, 246.94, 293.66], // G
        [146.83, 185.00, 220.00], // D
        [164.81, 196.00, 246.94], // Em
        [130.81, 164.81, 196.00]  // C
      ],
      melody: [392.00, 440.00, 493.88, 587.33],
      waveform: "sine"
    }
  },
  {
    id: "song-5",
    title: "Electric Pulse Matrix",
    artist: "CyberPulse",
    album: "Overdrive Protocol",
    cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80",
    duration: 230, // 3:50
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_c3527e3053.mp3?filename=cyberpunk-beat-10905.mp3",
    audioFallbackUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c8/Example.ogg",
    genre: "Cyberpunk / Bass / Industrial",
    year: "2024",
    bitrate: "320 kbps (Lossless)",
    isLiked: false,
    isFollowed: true,
    moods: ["cyberpunk", "bass", "dance", "techno", "gaming", "energy", "workout", "fast", "hype", "intense"],
    lyrics: [
      { time: 0, text: "System online. Overdrive protocol active." },
      { time: 8, text: "Bass frequency resonating at 40 hertz" },
      { time: 16, text: "Grid synchronization in 3, 2, 1..." },
      { time: 24, text: "Electric pulse surging through the veins" },
      { time: 34, text: "Maximum output engaged!" }
    ],
    synthProfile: {
      tempo: 130,
      chords: [
        [65.41, 130.81], // C2 low
        [55.00, 110.00], // A1 low
        [43.65, 87.31],  // F1 low
        [49.00, 98.00]   // G1 low
      ],
      melody: [261.63, 311.13, 349.23, 392.00, 466.16],
      waveform: "sawtooth"
    }
  },
  {
    id: "song-6",
    title: "Starlit Nebula Lullaby",
    artist: "Celeste Ambient",
    album: "Deep Cosmos",
    cover: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80",
    duration: 245, // 4:05
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_226b840e69.mp3?filename=ambient-piano-calm-10878.mp3",
    audioFallbackUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Erik_Satie_-_Gymnopedie_No._1.ogg",
    genre: "Ambient / Meditation / Piano",
    year: "2023",
    bitrate: "320 kbps",
    isLiked: false,
    isFollowed: false,
    moods: ["ambient", "sleep", "space", "meditation", "calm", "piano", "stars", "relaxing", "peaceful"],
    lyrics: [
      { time: 0, text: "In the quiet cradle of the cosmos" },
      { time: 12, text: "Stars ignite like distant dust" },
      { time: 24, text: "Breathing in the silence of infinity" },
      { time: 36, text: "Let your mind drift into the deep unknown" }
    ],
    synthProfile: {
      tempo: 60,
      chords: [
        [220.00, 277.18, 329.63], // A major
        [174.61, 220.00, 261.63], // F major
        [196.00, 246.94, 293.66], // G major
        [146.83, 185.00, 220.00]  // D major
      ],
      melody: [440.00, 554.37, 659.25],
      waveform: "sine"
    }
  },
  {
    id: "song-7",
    title: "Sunny Groove & Brass",
    artist: "Velvet Brass Ensemble",
    album: "Funkadelic Boulevard",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    duration: 188, // 3:08
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/02/07/audio_d1e8efcfbe.mp3?filename=funky-upbeat-groove-10702.mp3",
    audioFallbackUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c8/Example.ogg",
    genre: "Funk / Disco / Brass",
    year: "2024",
    bitrate: "320 kbps (Stereo Hi-Fi)",
    isLiked: true,
    isFollowed: true,
    moods: ["funk", "disco", "brass", "happy", "party", "dance", "upbeat", "summer", "groovy", "rock"],
    lyrics: [
      { time: 0, text: "Feel that rhythm shaking the street" },
      { time: 8, text: "Brass horns calling every dancing soul" },
      { time: 16, text: "Get up, step out into the sunshine!" },
      { time: 24, text: "Life is a groove, let it roll on" }
    ],
    synthProfile: {
      tempo: 115,
      chords: [
        [174.61, 220.00, 261.63, 311.13], // F7
        [207.65, 261.63, 311.13, 369.99], // Ab7
        [233.08, 293.66, 349.23, 415.30]  // Bb7
      ],
      melody: [523.25, 466.16, 415.30, 349.23],
      waveform: "square"
    }
  }
];

export const VOICE_SUGGESTIONS = [
  "Play jazz",
  "Play something relaxing",
  "Play synthwave",
  "Play Sunday Morning",
  "Play acoustic guitar",
  "Play cyberpunk workout",
  "Play ambient sleep music",
  "Play upbeat funk"
];
