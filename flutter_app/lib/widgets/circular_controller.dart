import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';

class CircularControllerWidget extends StatelessWidget {
  final bool isLiked;
  final VoidCallback onToggleLike;
  final VoidCallback onPrevious;
  final VoidCallback onNext;
  final bool isMuted;
  final VoidCallback onToggleMute;
  final bool isListening;
  final VoidCallback onVoiceMicTap;
  final VoidCallback onMoreTap;
  final VoidCallback onQueueTap;
  final VoidCallback onRepeatTap;
  final VoidCallback onLyricsTap;
  final bool isPlaying;
  final VoidCallback onTogglePlayPause;

  const CircularControllerWidget({
    Key? key,
    required this.isLiked,
    required this.onToggleLike,
    required this.onPrevious,
    required this.onNext,
    required this.isMuted,
    required this.onToggleMute,
    required this.isListening,
    required this.onVoiceMicTap,
    required this.onMoreTap,
    required this.onQueueTap,
    required this.onRepeatTap,
    required this.onLyricsTap,
    this.isPlaying = false,
    required this.onTogglePlayPause,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        // Voice Search Trigger Pill
        GestureDetector(
          onTap: onVoiceMicTap,
          child: Container(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
            decoration: BoxDecoration(
              color: const Color(0xFF202126),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: Colors.white10),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(CupertinoIcons.mic_fill, color: Colors.blueAccent, size: 14),
                const SizedBox(width: 6),
                Text(
                  isListening ? "Listening..." : "Voice Search Any Song",
                  style: const TextStyle(fontSize: 12, color: Colors.blueAccent, fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ),
        ),

        // Main Controller
        FittedBox(
          fit: BoxFit.scaleDown,
          child: SizedBox(
            width: 250,
            height: 250,
          child: Stack(
            alignment: Alignment.center,
            children: [
              // 1. Top-Left Satellite (More)
              Positioned(
                top: 4,
                left: 4,
                child: _buildSatelliteButton(
                  icon: CupertinoIcons.ellipsis,
                  onTap: onMoreTap,
                ),
              ),

              // 2. Top-Right Satellite (Queue)
              Positioned(
                top: 4,
                right: 4,
                child: _buildSatelliteButton(
                  icon: CupertinoIcons.list_bullet,
                  onTap: onQueueTap,
                ),
              ),

              // 3. Bottom-Left Satellite (Repeat/Shuffle)
              Positioned(
                bottom: 4,
                left: 4,
                child: _buildSatelliteButton(
                  icon: CupertinoIcons.repeat,
                  onTap: onRepeatTap,
                ),
              ),

              // 4. Bottom-Right Satellite (Lyrics)
              Positioned(
                bottom: 4,
                right: 4,
                child: _buildSatelliteButton(
                  icon: CupertinoIcons.music_note,
                  onTap: onLyricsTap,
                ),
              ),

              // --- MAIN CIRCULAR D-PAD WHEEL ---
              Container(
                width: 200,
                height: 200,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: const Color(0xFF222327),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.5),
                      blurRadius: 20,
                      offset: const Offset(0, 10),
                    ),
                  ],
                ),
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    // Top: Like
                    Positioned(
                      top: 10,
                      child: IconButton(
                        icon: Icon(
                          isLiked ? CupertinoIcons.heart_fill : CupertinoIcons.heart,
                          color: isLiked ? Colors.redAccent : Colors.grey,
                          size: 24,
                        ),
                        onPressed: onToggleLike,
                      ),
                    ),

                    // Left: Previous
                    Positioned(
                      left: 10,
                      child: IconButton(
                        icon: const Icon(CupertinoIcons.backward_fill, color: Colors.white, size: 22),
                        onPressed: onPrevious,
                      ),
                    ),

                    // Right: Next
                    Positioned(
                      right: 10,
                      child: IconButton(
                        icon: const Icon(CupertinoIcons.forward_fill, color: Colors.white, size: 22),
                        onPressed: onNext,
                      ),
                    ),

                    // Bottom: Mute/Volume
                    Positioned(
                      bottom: 10,
                      child: IconButton(
                        icon: Icon(
                          isMuted ? CupertinoIcons.volume_off : CupertinoIcons.volume_up,
                          color: isMuted ? Colors.redAccent : Colors.grey,
                          size: 22,
                        ),
                        onPressed: onToggleMute,
                      ),
                    ),

                    // Center: Play / Pause (Stop)
                    GestureDetector(
                      onTap: onTogglePlayPause,
                      child: Container(
                        width: 64,
                        height: 64,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: const Color(0xFF18191C),
                          border: Border.all(
                            color: isPlaying ? Colors.emerald : Colors.white10,
                            width: 1.5,
                          ),
                        ),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              isPlaying ? CupertinoIcons.pause_fill : CupertinoIcons.play_fill,
                              color: Colors.white,
                              size: 24,
                            ),
                            const SizedBox(height: 2),
                            Text(
                              isPlaying ? "PAUSE" : "PLAY",
                              style: TextStyle(
                                fontSize: 7,
                                fontWeight: FontWeight.bold,
                                color: isPlaying ? Colors.greenAccent : Colors.grey,
                                letterSpacing: 0.5,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    ],
  );
  }

  Widget _buildSatelliteButton({required IconData icon, required VoidCallback onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 48,
        height: 48,
        decoration: const BoxDecoration(
          shape: BoxShape.circle,
          color: Color(0xFF202125),
        ),
        child: Icon(icon, color: Colors.grey, size: 20),
      ),
    );
  }
}
