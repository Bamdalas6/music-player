class Song {
  final String id;
  final String title;
  final String artist;
  final String album;
  final String cover;
  final int duration;
  final String audioUrl;
  final String genre;
  bool isLiked;
  bool isFollowed;
  final List<String> moods;

  Song({
    required this.id,
    required this.title,
    required this.artist,
    required this.album,
    required this.cover,
    required this.duration,
    required this.audioUrl,
    required this.genre,
    this.isLiked = false,
    this.isFollowed = false,
    required this.moods,
  });

  factory Song.fromJson(Map<String, dynamic> json) {
    return Song(
      id: json['id'] as String,
      title: json['title'] as String,
      artist: json['artist'] as String,
      album: json['album'] as String,
      cover: json['cover'] as String,
      duration: json['duration'] as int,
      audioUrl: json['audioUrl'] as String,
      genre: json['genre'] as String,
      isLiked: json['isLiked'] as bool? ?? false,
      isFollowed: json['isFollowed'] as bool? ?? false,
      moods: List<String>.from(json['moods'] as List),
    );
  }
}
