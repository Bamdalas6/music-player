# Audio Player — Voice-Controlled Interactive Music Player

An audio player web application inspired by tactile circular controllers (iPod/D-pad style) featuring real-time **voice-activated search**, live audio synthesis, synchronized lyrics, audio visualizers, and static export support for **Cloudflare Pages / Workers**.

![Audio Player Preview](public/album_biplane.png)

---

## 🚀 Key Features

- **🎙️ Center Voice Microphone**:
  - Click the center circular button to activate speech recognition.
  - Say any song name, artist, genre, or mood (e.g., *"Play Sunday Morning"*, *"Play synthwave"*, *"Play jazz"*, *"Play relaxing acoustic"*, *"Play something upbeat"*).
  - Background NLP searches the library and automatically starts playback on screen.
  - Interactive voice prompt chips and text fallback input.

- **🎛️ Circular D-Pad Controller**:
  - **Top (Heart)**: Toggle like status with heart animation and favorite playlist sync.
  - **Left (`|◀◀`)**: Restart song or skip to previous track.
  - **Right (`▶▶|`)**: Skip to next track in queue.
  - **Bottom (Mute/Volume)**: One-click mute/silence toggle with visual audio indicator.
  - **Center (Mic)**: Voice search activation with listening wave pulses.

- **🛰️ Satellite Controls**:
  - **`•••` More Options**: Studio equalizer presets (Bass Boost, Vocal, Acoustic) and sleep timer.
  - **`☰` Playlist Queue**: Slide-over drawer with one-click track jumping.
  - **`🔁` Playback Mode**: Cycles through Repeat All, Repeat One, and Shuffle.
  - **`♫` Live Lyrics & Visualizer**: Line-by-line lyric tracking and real-time frequency visualizer.

- **📱 Design & Hardware Parity**:
  - Desert Titanium / Copper iPhone frame mockup with Dynamic Island and status bar.
  - Responsive toggle between Device Mockup view and Full Screen mode.
  - Scrubber progress bar with current and remaining timestamps.
  - Artist "Follow" button with follow state sync.

- **☁️ Cloudflare Pages & Workers Ready**:
  - Next.js static HTML export (`output: 'export'`).
  - Preconfigured `wrangler.toml` pointing to `./out`.
  - Web Audio API synthesizer fallback ensuring 100% resilient playback on static edge servers.

- **💙 Flutter Companion**:
  - Full Flutter project structure in `flutter_app/` with identical widget hierarchy and state controller for cross-platform iOS/Android deployment.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Styling**: Tailwind CSS + Lucide Icons
- **Audio Engine**: HTML5 Audio + Web Audio API (Synthesizer & Spectrum Analyser)
- **Voice Engine**: Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`) + NLP intent matching
- **Deployment**: Cloudflare Pages / Workers (`wrangler.toml`)
- **Mobile**: Flutter / Dart (`flutter_app/`)

---

## 💻 Getting Started Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000 in your browser
```

---

## 🧪 Testing & Build

```bash
# Run automated test suites
npm test

# Production build for Cloudflare
npm run build
```

---

## ☁️ Deploying to Cloudflare

```bash
# Deploy to Cloudflare Pages / Workers
npx wrangler pages deploy out/
# or
npx wrangler deploy
```
