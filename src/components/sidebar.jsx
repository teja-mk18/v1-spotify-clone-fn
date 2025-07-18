import { useState } from "react";
import { usePlaylist } from "../contexts/PlaylistContext";

function Sidebar() {
    // Placeholder: In a real app, these would come from context or API
    const [likedSongs, setLikedSongs] = useState([
        // Example liked songs
        { id: 1, title: "Song A" },
        { id: 2, title: "Song B" },
    ]);
    const [playlists, setPlaylists] = useState([
        // Example user playlists
        { id: 1, name: "Coding Mix", songs: [1] },
        { id: 2, name: "Chill Beats", songs: [2] },
    ]);

    const { setSelectedPlaylist } = usePlaylist();

    // Placeholder: Add playlist logic (e.g., open modal to create playlist)
    const handleAddPlaylist = () => {
        // Open modal or prompt to create playlist
        alert("Add playlist functionality coming soon!");
    };

    return (
        <div className="p-4 overflow-y-auto">
            <h2 className="text-xl font-bold mb-6">Library</h2>

            {/* Liked Songs */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2">Liked Songs</h3>
                <ul className="mb-2">
                    {likedSongs.length === 0 ? (
                        <li className="text-neutral-400">No liked songs yet</li>
                    ) : (
                        likedSongs.map(song => (
                            <li key={song.id} className="hover:text-green-400 cursor-pointer truncate">
                                {song.title}
                            </li>
                        ))
                    )}
                </ul>
            </div>

            {/* My Playlists */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">My Playlists</h3>
                    <button
                        className="ml-2 px-2 py-1 rounded bg-green-600 text-white text-xs hover:bg-green-700 transition"
                        onClick={handleAddPlaylist}
                        title="Create Playlist"
                    >
                        +
                    </button>
                </div>
                <ul>
                    {playlists.length === 0 ? (
                        <li className="text-neutral-400">No playlists yet</li>
                    ) : (
                        playlists.map(playlist => (
                            <li
                                key={playlist.id}
                                className="hover:text-green-400 cursor-pointer truncate"
                                onClick={() => setSelectedPlaylist(playlist)}
                            >
                                {playlist.name}
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
}

export { Sidebar };
