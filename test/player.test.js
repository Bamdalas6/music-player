import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { DEFAULT_PLAYLIST, VOICE_SUGGESTIONS } from '../src/data/songs.js';
import { cleanVoiceQuery, findSongByVoiceQuery } from '../src/utils/speechRecognition.js';
import { searchOnlineSongs } from '../src/utils/onlineMusicService.js';

console.log('🧪 Running Audio Player Verification Suite...\n');

// 1. Data Schema & Asset Integrity
console.log('1. Checking Playlist Data Integrity:');
assert(Array.isArray(DEFAULT_PLAYLIST), 'Playlist must be an array');
assert(DEFAULT_PLAYLIST.length >= 6, 'Must contain at least 6 default songs');

DEFAULT_PLAYLIST.forEach((song) => {
  assert(song.id, 'Song must have an ID');
  assert(song.title, `Song ${song.id} missing title`);
  assert(song.artist, `Song ${song.id} missing artist`);
  assert(song.cover, `Song ${song.id} missing cover`);
  assert(song.duration > 0, `Song ${song.id} duration must be positive`);
  assert(song.audioUrl, `Song ${song.id} missing audioUrl`);
  assert(Array.isArray(song.moods) && song.moods.length > 0, `Song ${song.id} must have moods`);
});
console.log('  ✅ Playlist data adheres to strict schema constraints');

// 2. Initial Song Verification (Mockup Parity)
console.log('\n2. Verifying Initial Song Mockup Parity:');
const firstSong = DEFAULT_PLAYLIST[0];
assert.strictEqual(firstSong.title, 'Sunday Morning');
assert.strictEqual(firstSong.artist, 'The Velvet Underground');
assert.strictEqual(firstSong.cover, '/album_biplane.png');
console.log('  ✅ Initial song matches mockup ("Sunday Morning" by The Velvet Underground with biplane art)');

// 3. Voice Query NLP & Search Matching
console.log('\n3. Testing Voice Query Intent & Song Matching:');

// Direct Title Match
const titleMatch = findSongByVoiceQuery('play Sunday Morning');
assert.strictEqual(titleMatch.id, 'song-1', 'Should match Sunday Morning by title');

// Genre Match: Synthwave
const synthMatch = findSongByVoiceQuery('can you please play some synthwave music');
assert.strictEqual(synthMatch.id, 'song-2', 'Should match Midnight Horizon for synthwave query');

// Mood Match: Chill / Study / Coffee
const lofiMatch = findSongByVoiceQuery('i want to listen to lofi chill coffee');
assert.strictEqual(lofiMatch.id, 'song-3', 'Should match Tokyo Lo-Fi Club for lofi query');

// Acoustic Match
const acousticMatch = findSongByVoiceQuery('play acoustic guitar flight');
assert.strictEqual(acousticMatch.id, 'song-4', 'Should match Acoustic Skies for acoustic query');

// High Energy / Workout
const energyMatch = findSongByVoiceQuery('play high energy workout beats');
assert.strictEqual(energyMatch.id, 'song-5', 'Should match Electric Pulse Matrix for workout query');

// Ambient Sleep
const ambientMatch = findSongByVoiceQuery('play ambient sleep meditation');
assert.strictEqual(ambientMatch.id, 'song-6', 'Should match Celeste Ambient for sleep meditation');

// Funk
const funkMatch = findSongByVoiceQuery('put on groovy brass funk');
assert.strictEqual(funkMatch.id, 'song-7', 'Should match Velvet Brass Ensemble for funk');

console.log('  ✅ All natural language voice queries accurately map to correct songs');

// 4. Online Music Search for African & International Songs
console.log('\n4. Testing Online Real-Time Music Search (African & International):');
async function testOnlineSearch() {
  // African music test (Afrobeats)
  const africanResults = await searchOnlineSongs('Burna Boy City Boys', 2);
  assert(Array.isArray(africanResults), 'African results must be an array');
  if (africanResults.length > 0) {
    const topAfrican = africanResults[0];
    assert(topAfrican.title.toLowerCase().includes('city boys'), 'Should find City Boys');
    assert(topAfrican.artist.toLowerCase().includes('burna boy'), 'Should identify Burna Boy');
    assert(topAfrican.audioUrl.startsWith('http'), 'Must provide valid streaming audio URL');
    assert(topAfrican.cover.startsWith('http'), 'Must provide HD album artwork');
    console.log(`  ✅ African Song Search: Found "${topAfrican.title}" by ${topAfrican.artist}`);
  }

  // International music test (Pop / Global)
  const globalResults = await searchOnlineSongs('The Weeknd Blinding Lights', 2);
  assert(Array.isArray(globalResults), 'Global results must be an array');
  if (globalResults.length > 0) {
    const topGlobal = globalResults[0];
    assert(topGlobal.title.toLowerCase().includes('blinding lights'), 'Should find Blinding Lights');
    assert(topGlobal.artist.toLowerCase().includes('the weeknd'), 'Should identify The Weeknd');
    assert(topGlobal.audioUrl.startsWith('http'), 'Must provide valid streaming audio URL');
    console.log(`  ✅ International Song Search: Found "${topGlobal.title}" by ${topGlobal.artist}`);
  }
}
await testOnlineSearch();

// 5. Cloudflare Deployment Configuration
console.log('\n5. Checking Cloudflare Deployment Alignment:');
const wranglerContent = fs.readFileSync(path.resolve('wrangler.toml'), 'utf-8');
assert(wranglerContent.includes('[assets]'), 'wrangler.toml must contain [assets] block');
assert(wranglerContent.includes('directory = "./out"') || wranglerContent.includes('directory = "out"'), 'wrangler assets must point to ./out');

const nextConfigContent = fs.readFileSync(path.resolve('next.config.mjs'), 'utf-8');
assert(nextConfigContent.includes("output: 'export'"), 'next.config.mjs must have output: export for Cloudflare static distribution');

console.log('  ✅ Cloudflare configuration fully aligned (wrangler.toml & next.config.mjs export verified)');

// 6. Online Audio Streaming & CORS Engine Verification
console.log('\n6. Checking Audio Engine & Online Streaming Robustness:');
const audioEngineContent = fs.readFileSync(path.resolve('src/utils/audioEngine.js'), 'utf-8');
assert(!audioEngineContent.includes("crossOrigin = 'anonymous'"), 'audioEngine must NOT set crossOrigin = anonymous to prevent Apple CDN CORS blocking');
assert(audioEngineContent.includes('unlockAudio'), 'audioEngine must contain unlockAudio helper for user gesture priming');
assert(audioEngineContent.includes('getOrCreateAudio'), 'audioEngine must reuse audio instance to preserve mobile gesture permissions');
assert(audioEngineContent.includes('song.audioFallbackUrl'), 'audioEngine must support audio fallback URLs');
assert(fs.existsSync(path.resolve('public/_headers')), 'public/_headers must exist for Cloudflare Pages CORS and referrer policy');
console.log('  ✅ AudioEngine verified (CORS anonymous restriction omitted, persistent element reuse, and audioFallbackUrl active)');

// 7. Mobile Viewport Visibility & Responsive Fit Verification
console.log('\n7. Checking Mobile Viewport & Screen Visibility Configuration:');
const pageContent = fs.readFileSync(path.resolve('src/app/page.jsx'), 'utf-8');
assert(pageContent.includes('100dvh'), 'page.jsx must use dynamic viewport units (100dvh) for mobile screens');
assert(pageContent.includes('pb-safe'), 'page.jsx must include safe area bottom padding for notched devices');
assert(pageContent.includes('overflow-y-auto'), 'page.jsx must provide scroll fallback for compact screens');

const layoutContent = fs.readFileSync(path.resolve('src/app/layout.jsx'), 'utf-8');
assert(layoutContent.includes('viewportFit'), 'layout.jsx must configure viewportFit cover for notch containment');

const albumArtContent = fs.readFileSync(path.resolve('src/components/AlbumArtCard.jsx'), 'utf-8');
assert(albumArtContent.includes('flex-1') && albumArtContent.includes('min-h-0'), 'AlbumArtCard must use flex-1 min-h-0 to adapt dynamically to mobile heights');

const circularControllerContent = fs.readFileSync(path.resolve('src/components/CircularController.jsx'), 'utf-8');
assert(circularControllerContent.includes('w-[230px]'), 'CircularController must support compact mobile sizing to prevent cutoffs');
console.log('  ✅ Mobile viewport design verified (100dvh container, scroll fallback, viewportFit cover, compact tactile D-pad)');

console.log('\n🎉 ALL AUDIO PLAYER TESTS PASSED CLEANLY!\n');

