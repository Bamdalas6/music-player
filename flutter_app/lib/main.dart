import 'package:flutter/material.dart';
import 'models/song.dart';
import 'widgets/circular_controller.dart';

void main() {
  runApp(const AudioPlayerFlutterApp());
}

class AudioPlayerFlutterApp extends StatelessWidget {
  const AudioPlayerFlutterApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Audio Player',
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: const Color(0xFF161719),
      ),
      home: const AudioPlayerScreen(),
    );
  }
}

class AudioPlayerScreen extends StatefulWidget {
  const AudioPlayerScreen({Key? key}) : super(key: key);

  @override
  State<AudioPlayerScreen> createState() => _AudioPlayerScreenState();
}

class _AudioPlayerScreenState extends State<AudioPlayerScreen> {
  final List<Song> _playlist = [
    Song(
      id: "song-1",
      title: "Sunday Morning",
      artist: "The Velvet Underground",
      album: "The Velvet Underground & Nico",
      cover: "assets/images/album_biplane.png",
      duration: 174,
      audioUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3",
      genre: "Dream Pop / Indie",
      moods: ["relaxing", "calm", "morning", "sunday"],
    ),
    Song(
      id: "song-2",
      title: "Midnight Horizon",
      artist: "Neon Mirage",
      album: "Outrun 1986",
      cover: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
      duration: 215,
      audioUrl: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=synthwave-80s-110045.mp3",
      genre: "Synthwave",
      moods: ["synthwave", "electronic", "drive"],
    ),
  ];

  int _currentIndex = 0;
  bool _isPlaying = false;
  bool _isMuted = false;
  bool _isListening = false;
  double _currentSeconds = 34.0;

  Song get _currentSong => _playlist[_currentIndex];

  void _showSnackBar(String text) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(text),
        duration: const Duration(seconds: 2),
        backgroundColor: const Color(0xFF222328),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF161719),
      body: SafeArea(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            // Top Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  IconButton(
                    icon: const Icon(Icons.arrow_back, color: Colors.white),
                    onPressed: () => _showSnackBar("Back to library"),
                  ),
                  const Text(
                    "Now Playing",
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                  IconButton(
                    icon: const Icon(Icons.info_outline, color: Colors.white),
                    onPressed: () => _showSnackBar("Track info: ${_currentSong.title}"),
                  ),
                ],
              ),
            ),

            // Album Art
            Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 4),
                child: Center(
                  child: AspectRatio(
                    aspectRatio: 1,
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(24),
                      child: Image.network(
                        _currentSong.cover,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) => Container(
                          color: const Color(0xFF222328),
                          child: const Icon(Icons.music_note, size: 64, color: Colors.white24),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),

            // Track Info Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 6),
              child: Row(
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: Container(
                      width: 42,
                      height: 42,
                      color: Colors.white12,
                      child: const Icon(Icons.music_note, color: Colors.white70),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          _currentSong.artist,
                          style: const TextStyle(fontSize: 12, color: Colors.grey),
                        ),
                        Text(
                          _currentSong.title,
                          style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  ),
                  ElevatedButton(
                    onPressed: () {
                      setState(() {
                        _currentSong.isFollowed = !_currentSong.isFollowed;
                      });
                      _showSnackBar(_currentSong.isFollowed ? "Following" : "Unfollowed");
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white,
                      foregroundColor: Colors.black,
                      shape: const StadiumBorder(),
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                    ),
                    child: Text(_currentSong.isFollowed ? "Following" : "Follow"),
                  ),
                ],
              ),
            ),

            // Progress Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Column(
                children: [
                  SliderTheme(
                    data: SliderTheme.of(context).copyWith(
                      trackHeight: 3,
                      thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 6),
                      activeTrackColor: Colors.white,
                      inactiveTrackColor: const Color(0xFF2C2D32),
                      thumbColor: Colors.white,
                    ),
                    child: Slider(
                      value: _currentSeconds,
                      min: 0,
                      max: _currentSong.duration.toDouble(),
                      onChanged: (val) {
                        setState(() => _currentSeconds = val);
                      },
                    ),
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text("0:${_currentSeconds.toInt().toString().padLeft(2, '0')}", style: const TextStyle(color: Colors.grey, fontSize: 11)),
                      const Text("-2:59", style: TextStyle(color: Colors.grey, fontSize: 11)),
                    ],
                  ),
                ],
              ),
            ),

            // Circular Controller
            CircularControllerWidget(
              isLiked: _currentSong.isLiked,
              onToggleLike: () {
                setState(() => _currentSong.isLiked = !_currentSong.isLiked);
                _showSnackBar(_currentSong.isLiked ? "Saved to Liked Songs" : "Removed from Liked");
              },
              onPrevious: () {
                setState(() {
                  _currentIndex = (_currentIndex - 1 + _playlist.length) % _playlist.length;
                });
                _showSnackBar("Playing: ${_currentSong.title}");
              },
              onNext: () {
                setState(() {
                  _currentIndex = (_currentIndex + 1) % _playlist.length;
                });
                _showSnackBar("Playing: ${_currentSong.title}");
              },
              isMuted: _isMuted,
              onToggleMute: () {
                setState(() => _isMuted = !_isMuted);
                _showSnackBar(_isMuted ? "Audio Muted" : "Audio Unmuted");
              },
              isListening: _isListening,
              onVoiceMicTap: () {
                setState(() => _isListening = !_isListening);
                _showSnackBar(_isListening ? "Listening for voice command..." : "Voice search cancelled");
              },
              onMoreTap: () => _showSnackBar("More options"),
              onQueueTap: () => _showSnackBar("Queue / Playlist"),
              onRepeatTap: () => _showSnackBar("Repeat mode toggled"),
              onLyricsTap: () => _showSnackBar("Lyrics & Visualizer"),
            ),
          ],
        ),
      ),
    );
  }
}
