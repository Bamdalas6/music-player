/**
 * Online Music Search Service
 * Connects directly to global music catalog (Afrobeats, Amapiano, International Pop, Rock, Hip Hop, R&B, etc.)
 * Provides instant 30-second high-fidelity streaming audio previews and HD album artwork.
 */

/**
 * Helper to perform JSONP search as fallback when fetch is blocked by CORS or adblockers
 */
function searchWithJsonp(query, limit = 8) {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return resolve([]);
    }
    const callbackName = `itunes_search_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const script = document.createElement('script');
    let timeoutId;

    window[callbackName] = (data) => {
      clearTimeout(timeoutId);
      cleanup();
      resolve(data && data.results ? data.results : []);
    };

    function cleanup() {
      try {
        if (window[callbackName]) {
          delete window[callbackName];
        }
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      } catch (e) {
        // ignore cleanup error
      }
    }

    timeoutId = setTimeout(() => {
      cleanup();
      resolve([]);
    }, 6000);

    script.onerror = () => {
      clearTimeout(timeoutId);
      cleanup();
      resolve([]);
    };

    script.src = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=song&limit=${limit}&callback=${callbackName}`;
    document.body.appendChild(script);
  });
}

function mapSearchResults(results) {
  return results
    .filter((item) => item.previewUrl && item.trackName)
    .map((item) => {
      // Ensure HTTPS for both preview audio and album artwork to avoid Mixed Content errors on HTTPS Cloudflare Pages
      const secureAudioUrl = item.previewUrl.replace(/^http:\/\//i, 'https://');
      const secureArtwork = item.artworkUrl100
        ? item.artworkUrl100.replace(/^http:\/\//i, 'https://').replace('100x100bb.jpg', '600x600bb.jpg')
        : '/album_biplane.png';

      const releaseYear = item.releaseDate ? item.releaseDate.substring(0, 4) : '2024';

      return {
        id: `online-${item.trackId || Math.random().toString(36).substring(7)}`,
        title: item.trackName,
        artist: item.artistName,
        album: item.collectionName || item.trackName,
        cover: secureArtwork,
        duration: 30, // Official direct audio preview duration
        audioUrl: secureAudioUrl,
        audioFallbackUrl: secureAudioUrl,
        genre: item.primaryGenreName || 'International',
        year: releaseYear,
        bitrate: '256 kbps (AAC Stereo Audio Stream)',
        isLiked: false,
        isFollowed: false,
        isOnline: true,
        moods: [
          (item.primaryGenreName || 'music').toLowerCase(),
          (item.artistName || '').toLowerCase(),
          'online stream'
        ],
        lyrics: [
          { time: 0, text: `♪ ${item.trackName} ♪` },
          { time: 5, text: `Performed by ${item.artistName}` },
          { time: 12, text: `From the album "${item.collectionName || item.trackName}"` },
          { time: 20, text: `Release Year: ${releaseYear}` }
        ],
        synthProfile: {
          tempo: 105,
          chords: [
            [261.63, 329.63, 392.00],
            [220.00, 261.63, 329.63],
            [174.61, 220.00, 261.63],
            [196.00, 246.94, 293.66]
          ],
          melody: [392.00, 440.00, 523.25, 659.25],
          waveform: 'sine'
        }
      };
    });
}

export async function searchOnlineSongs(query, limit = 8) {
  if (!query || !query.trim()) return [];

  const cleanQuery = query.trim();
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(cleanQuery)}&media=music&entity=song&limit=${limit}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Music search API failed with status ${response.status}`);
    }

    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      return [];
    }

    return mapSearchResults(data.results);
  } catch (error) {
    console.warn('Online song search fetch failed, attempting JSONP fallback:', error);
    try {
      const jsonpResults = await searchWithJsonp(cleanQuery, limit);
      if (jsonpResults && jsonpResults.length > 0) {
        return mapSearchResults(jsonpResults);
      }
    } catch (jsonpErr) {
      console.warn('JSONP fallback also failed:', jsonpErr);
    }
    return [];
  }
}
