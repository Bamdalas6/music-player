/**
 * Online Music Search Service
 * Connects directly to global music catalog (Afrobeats, Amapiano, International Pop, Rock, Hip Hop, R&B, etc.)
 * Provides instant 30-second high-fidelity streaming audio previews and HD album artwork.
 */

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

    return data.results
      .filter((item) => item.previewUrl && item.trackName)
      .map((item) => {
        // Upgrade thumbnail to 600x600 HD artwork
        const hdArtwork = item.artworkUrl100
          ? item.artworkUrl100.replace('100x100bb.jpg', '600x600bb.jpg')
          : '/album_biplane.png';

        const releaseYear = item.releaseDate ? item.releaseDate.substring(0, 4) : '2024';

        return {
          id: `online-${item.trackId || Math.random().toString(36).substring(7)}`,
          title: item.trackName,
          artist: item.artistName,
          album: item.collectionName || item.trackName,
          cover: hdArtwork,
          duration: 30, // Official direct audio preview duration
          audioUrl: item.previewUrl,
          audioFallbackUrl: item.previewUrl,
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
  } catch (error) {
    console.warn('Online song search network error:', error);
    return [];
  }
}
