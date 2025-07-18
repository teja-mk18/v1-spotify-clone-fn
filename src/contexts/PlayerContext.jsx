import { createContext, useContext, useState, useRef, useEffect } from "react";

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  // --- New State for Queue and Controls ---
  const [queue, setQueue] = useState([]); // Array of songs
  const [currentIndex, setCurrentIndex] = useState(-1); // Index in queue
  const [shuffle, setShuffle] = useState(false);
  // repeatMode: 'off', 'all', 'one'
  const [repeatMode, setRepeatMode] = useState('off');
  const [originalQueue, setOriginalQueue] = useState([]); // For restoring after shuffle

  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    const onEnded = () => {
      if (repeatMode === 'one') {
        // Repeat current song
        audio.currentTime = 0;
        audio.play();
      } else if (repeatMode === 'all') {
        if (queue.length > 1) playNext();
        else {
          audio.currentTime = 0;
          audio.play();
        }
      } else {
        playNext();
      }
    };

    // NEW: Keep isPlaying in sync with audio element
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, [queue, currentIndex, repeatMode]);

  // --- New: Keep currentSong in sync with queue/currentIndex ---
  useEffect(() => {
    if (queue.length && currentIndex >= 0 && currentIndex < queue.length) {
      setCurrentSong(queue[currentIndex]);
    }
  }, [queue, currentIndex]);

  // --- New: Play a song, optionally with a queue ---
  const playSong = (song, songQueue = null) => {
    let newQueue = queue;
    if (songQueue) {
      newQueue = songQueue;
      setQueue(songQueue);
      setOriginalQueue(songQueue);
    }
    const idx = newQueue.findIndex((s) => s._id === song._id || s.id === song.id);
    setCurrentIndex(idx);
    setCurrentSong(song);
  };

  // --- New: Play next song ---
  const playNext = () => {
    if (!queue.length) return;
    let nextIdx = currentIndex + 1;
    if (nextIdx >= queue.length) {
      if (repeatMode === 'all') nextIdx = 0;
      else return;
    }
    setCurrentIndex(nextIdx);
    setCurrentSong(queue[nextIdx]);
  };

  // --- New: Play previous song ---
  const playPrevious = () => {
    if (!queue.length) return;
    let prevIdx = currentIndex - 1;
    if (prevIdx < 0) {
      if (repeatMode === 'all') prevIdx = queue.length - 1;
      else return;
    }
    setCurrentIndex(prevIdx);
    setCurrentSong(queue[prevIdx]);
  };

  // --- New: Shuffle logic ---
  const toggleShuffle = () => {
    setShuffle((prev) => {
      if (!prev) {
        setOriginalQueue(queue);
        if (queue.length > 1) {
          const shuffled = [queue[currentIndex], ...queue.filter((_, i) => i !== currentIndex).sort(() => Math.random() - 0.5)];
          setQueue(shuffled);
          setCurrentIndex(0);
        }
      } else {
        setQueue(originalQueue);
        setCurrentIndex(originalQueue.findIndex(s => s._id === currentSong._id || s.id === currentSong.id));
      }
      return !prev;
    });
  };

  // --- New: Repeat logic with repeat-one ---
  // Cycles: off -> all -> one -> off
  const toggleRepeat = () => {
    setRepeatMode((mode) => {
      if (mode === 'off') return 'all';
      if (mode === 'all') return 'one';
      return 'off';
    });
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (currentSong && audio) {
      audio.src = `${import.meta.env.VITE_BACKEND_URL.replace(/\/api\/v1\/?$/, "")}${currentSong.fileUrl}`;
      audio.load();

      const handleCanPlay = () => {
        audio.play().then(() => setIsPlaying(true)).catch(err => {
          console.warn("Autoplay failed:", err.message);
        });
        audio.removeEventListener('canplay', handleCanPlay);
      };

      audio.addEventListener('canplay', handleCanPlay);

      // Cleanup in case currentSong changes before canplay fires
      return () => {
        audio.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, [currentSong]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const seekTo = (time) => {
    if (audioRef.current) audioRef.current.currentTime = time;
  };

  const rewind10 = () => {
    if (audioRef.current) audioRef.current.currentTime -= 10;
  };

  const forward10 = () => {
    if (audioRef.current) audioRef.current.currentTime += 10;
  };

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        currentTime,
        duration,
        volume,
        setVolume,
        playSong,
        togglePlayPause,
        seekTo,
        rewind10,
        forward10,
        audioRef,
        playNext,
        playPrevious,
        shuffle,
        repeatMode,
        toggleShuffle,
        toggleRepeat,
      }}
    >
      {children}
      <audio ref={audioRef} className="hidden" />
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
