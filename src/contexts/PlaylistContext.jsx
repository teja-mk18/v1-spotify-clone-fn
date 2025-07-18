import { createContext, useContext, useState } from "react";

const PlaylistContext = createContext();

export function PlaylistProvider({ children }) {
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);

    return (
        <PlaylistContext.Provider value={{ selectedPlaylist, setSelectedPlaylist }}>
            {children}
        </PlaylistContext.Provider>
    );
}

export function usePlaylist() {
    return useContext(PlaylistContext);
} 