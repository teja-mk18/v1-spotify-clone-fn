import { useEffect, useState } from "react";
import { usePlayer } from "../contexts/PlayerContext";
import { usePlaylist } from "../contexts/PlaylistContext";
import { axiosInstance } from "../axios/axiosInstance";

const MainContent = () => {
  const [songs, setSongs] = useState([]);
  const { playSong, currentSong } = usePlayer();
  const { selectedPlaylist } = usePlaylist();
  const [likedSongIds, setLikedSongIds] = useState([]);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await axiosInstance.get("/songs");
        if (Array.isArray(res.data)) setSongs(res.data);
      } catch (err) {
        console.error("Failed to fetch songs:", err);
      }
    };
    fetchSongs();
  }, []);

  // Fetch liked songs from backend on mount
  useEffect(() => {
    const fetchLikedSongs = async () => {
      try {
        const res = await axiosInstance.get("/liked/songs");
        // If backend returns { likedSongs: [ ...song objects... ] }
        setLikedSongIds(res.data.likedSongs.map(song => song._id || song.id));
      } catch (err) {
        console.error("Failed to fetch liked songs", err);
      }
    };
    fetchLikedSongs();
  }, []);

  const isLiked = currentSong && likedSongIds.includes(currentSong._id || currentSong.id);

  const handleLike = async () => {
    if (!currentSong) return;
    const songId = currentSong._id || currentSong.id;
    try {
      if (isLiked) {
        // Unlike
        await axiosInstance.post(`/liked/unlike/${songId}`);
        setLikedSongIds((prev) => prev.filter((id) => id !== songId));
      } else {
        // Like
        await axiosInstance.post(`/liked/like/${songId}`);
        setLikedSongIds((prev) => [...prev, songId]);
      }
    } catch (err) {
      console.error("Failed to update like status", err);
    }
  };

  // If a playlist is selected, show its songs
  if (selectedPlaylist) {
    const playlistSongs = songs.filter(song => selectedPlaylist.songs.includes(song.id || song._id));
    return (
      <div className="flex-1 overflow-auto p-4 pb-24">
        <h1 className="text-2xl font-bold mb-2 text-white">{selectedPlaylist.name}</h1>
        <button
          className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          onClick={() => playlistSongs.length && playSong(playlistSongs[0], playlistSongs)}
        >
          ▶ Play Playlist
        </button>
        <div className="flex justify-start">
          <div
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
            style={{ width: "864px" }}
          >
            {playlistSongs.length === 0 ? (
              <div className="text-neutral-400">No songs in this playlist</div>
            ) : (
              playlistSongs.map((song) => (
                <div
                  key={song._id || song.id}
                  className="group w-36 bg-neutral p-2 rounded border border-none hover:border-neutral-700 hover:bg-neutral-700 text-white cursor-pointer transition-transform duration-200 active:scale-95"
                  onClick={() => playSong(song, playlistSongs)}
                >
                  <div className="relative">
                    <img
                      src={song.coverImage}
                      alt={song.title}
                      className="w-32 h-32 object-cover rounded"
                    />
                  </div>
                  <p className="mt-2 font-medium truncate">{song.title}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default: show all songs
  return (
    <div className="flex-1 overflow-auto p-4 pb-24">
      <h1 className="text-2xl font-bold mb-4 text-white">All Songs</h1>
      <div className="flex justify-start">
        <div
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
          style={{ width: "864px" }}
        >
          {songs.map((song) => {
            return (
              <div
                key={song._id || song.id}
                className="group w-36 bg-neutral p-2 rounded border border-none hover:border-neutral-700 hover:bg-neutral-700 text-white cursor-pointer transition-transform duration-200 active:scale-95"
                onClick={() => playSong(song, songs)}
              >
                <div className="relative">
                  <img
                    src={song.coverImage}
                    alt={song.title}
                    className="w-32 h-32 object-cover rounded"
                  />
                </div>
                <p className="mt-2 font-medium truncate">{song.title}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export { MainContent };
