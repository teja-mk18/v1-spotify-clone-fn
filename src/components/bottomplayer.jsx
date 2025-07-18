import { usePlayer } from "../contexts/PlayerContext";
import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
} from "lucide-react";
import { useSidebarToggle } from "../contexts/SidebarToggleContext";
import { useEffect, useRef, useState } from "react";
import { Heart } from "lucide-react";
import { axiosInstance } from "../axios/axiosInstance";

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

export const BottomPlayer = () => {
  const {
    currentSong,
    isPlaying,
    togglePlayPause,
    currentTime,
    duration,
    seekTo,
    volume,
    setVolume,
    playNext,
    playPrevious,
    shuffle,
    repeatMode,
    toggleShuffle,
    toggleRepeat,
  } = usePlayer();

  const { toggleSidebar, setSidebarOpen } = useSidebarToggle();

  const playerRef = useRef(null);
  const timelineRef = useRef(null);
  const volumeRef = useRef(null);

  // Drag state
  const [draggingTimeline, setDraggingTimeline] = useState(false);
  const [draggingVolume, setDraggingVolume] = useState(false);
  const [timelineHovered, setTimelineHovered] = useState(false);
  const [volumeHovered, setVolumeHovered] = useState(false);
  const [likedSongs, setLikedSongs] = useState([]);

  // Fetch liked songs from backend on mount
  useEffect(() => {
    const fetchLikedSongs = async () => {
      try {
        const res = await axiosInstance.get("/liked/songs");
        setLikedSongs(res.data.likedSongs.map(song => song._id || song.id));
      } catch (err) {
        console.error("Failed to fetch liked songs", err);
      }
    };
    fetchLikedSongs();
  }, []);

  const isLiked = currentSong && likedSongs.includes(currentSong._id || currentSong.id);

  const handleLike = async () => {
    if (!currentSong) return;
    const songId = currentSong._id || currentSong.id;
    try {
      if (isLiked) {
        await axiosInstance.post(`/liked/unlike/${songId}`);
        setLikedSongs((prev) => prev.filter((id) => id !== songId));
      } else {
        await axiosInstance.post(`/liked/like/${songId}`);
        setLikedSongs((prev) => [...prev, songId]);
      }
    } catch (err) {
      console.error("Failed to update like status", err);
    }
  };

  // Auto-open sidebar when song starts playing
  useEffect(() => {
    if (currentSong && isPlaying) setSidebarOpen(true);
  }, [currentSong, isPlaying, setSidebarOpen]);

  // Timeline drag handlers
  const handleTimelineMouseDown = (e) => {
    setDraggingTimeline(true);
    handleTimelineSeek(e);
  };
  const handleTimelineMouseMove = (e) => {
    if (draggingTimeline) handleTimelineSeek(e);
  };
  const handleTimelineMouseUp = () => setDraggingTimeline(false);

  const handleTimelineSeek = (e) => {
    const bar = timelineRef.current;
    if (!bar || !currentSong) return;
    const rect = bar.getBoundingClientRect();
    const x =
      e.type.startsWith("touch")
        ? e.touches[0].clientX - rect.left
        : e.clientX - rect.left;
    const percent = Math.min(Math.max(x / rect.width, 0), 1);
    seekTo(percent * duration);
  };

  // Volume drag handlers
  const handleVolumeMouseDown = (e) => {
    setDraggingVolume(true);
    handleVolumeSeek(e);
  };
  const handleVolumeMouseMove = (e) => {
    if (draggingVolume) handleVolumeSeek(e);
  };
  const handleVolumeMouseUp = () => setDraggingVolume(false);

  const handleVolumeSeek = (e) => {
    const bar = volumeRef.current;
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    const x =
      e.type.startsWith("touch")
        ? e.touches[0].clientX - rect.left
        : e.clientX - rect.left;
    const percent = Math.min(Math.max(x / rect.width, 0), 1);
    setVolume(percent);
  };

  // Attach global mouse/touch listeners for drag
  useEffect(() => {
    if (draggingTimeline) {
      window.addEventListener("mousemove", handleTimelineMouseMove);
      window.addEventListener("mouseup", handleTimelineMouseUp);
      window.addEventListener("touchmove", handleTimelineMouseMove);
      window.addEventListener("touchend", handleTimelineMouseUp);
    }
    if (draggingVolume) {
      window.addEventListener("mousemove", handleVolumeMouseMove);
      window.addEventListener("mouseup", handleVolumeMouseUp);
      window.addEventListener("touchmove", handleVolumeMouseMove);
      window.addEventListener("touchend", handleVolumeMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleTimelineMouseMove);
      window.removeEventListener("mouseup", handleTimelineMouseUp);
      window.removeEventListener("touchmove", handleTimelineMouseMove);
      window.removeEventListener("touchend", handleTimelineMouseUp);

      window.removeEventListener("mousemove", handleVolumeMouseMove);
      window.removeEventListener("mouseup", handleVolumeMouseUp);
      window.removeEventListener("touchmove", handleVolumeMouseMove);
      window.removeEventListener("touchend", handleVolumeMouseUp);
    };
  });

  const handlePlayerClick = (e) => {
    const clickedElement = e.target;
    const isInteractive =
      clickedElement.closest("button") ||
      clickedElement.closest("svg") ||
      clickedElement.closest("input") ||
      clickedElement.closest(".timeline") ||
      clickedElement.closest(".volume");
    if (!isInteractive) toggleSidebar();
  };

  return (
    <div
      ref={playerRef}
      onClick={handlePlayerClick}
      className="fixed bottom-0 left-0 w-full h-20 bg-black text-white flex items-center justify-between px-6 z-50"
      style={{ fontFamily: "Inter, Arial, sans-serif" }}
    >
      {/* LEFT: Cover + Title + Artist */}
      <div className="flex items-center gap-4 w-1/4 min-w-[200px]">
        {currentSong ? (
          <>
            <img
              src={currentSong.coverImage}
              alt={currentSong.title}
              className="w-14 h-14 rounded-md object-cover shadow"
            />
            <div>
              <div className="text-base font-semibold truncate max-w-[120px]">
                {currentSong.title}
              </div>
              <div className="text-xs text-neutral-400 truncate max-w-[120px]">
                {currentSong.artist}
              </div>
            </div>
            <button
              className="ml-2 p-1 rounded-full hover:bg-neutral-700 transition"
              onClick={handleLike}
              title={isLiked ? "Unlike" : "Like"}
              aria-label={isLiked ? "Unlike" : "Like"}
              style={{ color: isLiked ? "#ff0000" : "#fff" }}
            >
              <Heart fill={isLiked ? "#ff0000" : "none"} />
            </button>
          </>
        ) : (
          <div className="text-sm font-semibold text-neutral-400">
            No song selected
          </div>
        )}
      </div>

      {/* CENTER: Controls + Timeline */}
      <div className="flex flex-col items-center w-2/4 min-w-[300px]">
        <div className="flex items-center gap-6">
          {/* Shuffle */}
          <button
            className={`control-btn${shuffle ? " active" : ""}`}
            onClick={toggleShuffle}
            title="Shuffle"
            aria-label="Shuffle"
            style={shuffle ? { color: "#1db954" } : {}}
          >
            <Shuffle />
          </button>
          {/* Previous */}
          <button
            className="control-btn"
            onClick={playPrevious}
            title="Previous"
            aria-label="Previous"
          >
            <SkipBack />
          </button>
          {/* Play/Pause */}
          <button
            className="play-btn-normal"
            onClick={togglePlayPause}
            title={isPlaying ? "Pause" : "Play"}
            aria-label={isPlaying ? "Pause" : "Play"}
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'white',
              color: 'black',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              border: 'none',
              cursor: 'pointer',
              outline: 'none',
              transition: 'background 0.2s, transform 0.1s',
            }}
          >
            {isPlaying ? <Pause /> : <Play />}
          </button>
          {/* Next */}
          <button
            className="control-btn"
            onClick={playNext}
            title="Next"
            aria-label="Next"
          >
            <SkipForward />
          </button>
          {/* Repeat */}
          <button
            className={`control-btn${repeatMode !== 'off' ? ' active' : ''}`}
            onClick={toggleRepeat}
            title={repeatMode === 'one' ? 'Repeat One' : repeatMode === 'all' ? 'Repeat All' : 'Repeat Off'}
            aria-label={repeatMode === 'one' ? 'Repeat One' : repeatMode === 'all' ? 'Repeat All' : 'Repeat Off'}
            style={repeatMode !== 'off' ? { color: '#1db954', position: 'relative' } : { position: 'relative' }}
          >
            <Repeat />
            {repeatMode === 'one' && (
              <span style={{
                position: 'absolute',
                right: 6,
                bottom: 6,
                fontSize: 16,
                fontWeight: 'bold',
                color: '#fff',
                textShadow: '0 0 2px #000, 0 0 2px #000',
                pointerEvents: 'none',
                userSelect: 'none',
                lineHeight: 1,
              }}>1</span>
            )}
          </button>
        </div>
        <div className="flex items-center gap-2 w-full text-xs text-neutral-400">
          <span className="min-w-[40px] text-right">
            {formatTime(currentSong ? currentTime : 0)}
          </span>
          <div
            ref={timelineRef}
            className="timeline flex-1 h-1 rounded-full relative cursor-pointer mx-2"
            onMouseDown={handleTimelineMouseDown}
            onTouchStart={handleTimelineMouseDown}
            onMouseEnter={() => setTimelineHovered(true)}
            onMouseLeave={() => setTimelineHovered(false)}
            style={{ background: "#535353" }} // Spotify gray
          >
            {/* Progress bar: white by default, green on hover/drag */}
            <div
              className="h-1 rounded-full absolute top-0 left-0"
              style={{
                width: currentSong
                  ? `${(currentTime / duration) * 100 || 0}%`
                  : "0%",
                background: (timelineHovered || draggingTimeline)
                  ? "#1db954"
                  : "white", // Always white unless hovered/dragged
                transition: draggingTimeline ? "none" : "width 0.2s",
                zIndex: 1,
              }}
            ></div>
            {/* White knob only on hover or drag, no border */}
            {currentSong && (timelineHovered || draggingTimeline) && (
              <div
                className="absolute top-1/2"
                style={{
                  left: `${(currentTime / duration) * 100 || 0}%`,
                  transform: "translate(-50%, -50%)",
                  zIndex: 2,
                }}
              >
                <div
                  className="w-4 h-4 bg-white rounded-full shadow transition"
                  style={{
                    boxShadow: "0 0 4px rgba(0,0,0,0.3)",
                    cursor: "pointer",
                  }}
                />
              </div>
            )}
          </div>
          <span className="min-w-[40px]">
            {formatTime(currentSong ? duration : 0)}
          </span>
        </div>
      </div>

      {/* RIGHT: Volume */}
      <div className="flex items-center gap-3 w-1/4 justify-end volume min-w-[120px]">
        <button
          className="p-1 rounded hover:bg-neutral-700 transition"
          onClick={() => setVolume(volume === 0 ? 0.5 : 0)}
        >
          {volume === 0 ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </button>
        {/* Volume bar */}
        <div
          ref={volumeRef}
          className="volume w-24 h-1 rounded-full relative cursor-pointer"
          onMouseDown={handleVolumeMouseDown}
          onTouchStart={handleVolumeMouseDown}
          onMouseEnter={() => setVolumeHovered(true)}
          onMouseLeave={() => setVolumeHovered(false)}
          style={{ background: "#535353" }} // Spotify gray
        >
          {/* Progress bar: white by default, green on hover/drag */}
          <div
            className="h-1 rounded-full absolute top-0 left-0"
            style={{
              width: `${volume * 100}%`,
              background: (volumeHovered || draggingVolume)
                ? "#1db954"
                : "white", // Always white unless hovered/dragged
              transition: draggingVolume ? "none" : "width 0.2s",
              zIndex: 1,
            }}
          ></div>
          {/* White knob only on hover or drag, no border */}
          {(volumeHovered || draggingVolume) && (
            <div
              className="absolute top-1/2"
              style={{
                left: `${volume * 100}%`,
                transform: "translate(-50%, -50%)",
                zIndex: 2,
              }}
            >
              <div
                className="w-4 h-4 bg-white rounded-full shadow transition"
                style={{
                  boxShadow: "0 0 4px rgba(0,0,0,0.3)",
                  cursor: "pointer",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
