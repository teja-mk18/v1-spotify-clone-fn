import { usePlayer } from "../contexts/PlayerContext";

const RightSidebar = ({ isOpen }) => {
  const { currentSong } = usePlayer();

  if (!currentSong || !isOpen) return null;

  const {
    title,
    artist,
    album,
    coverImage,
    spotifyUrl,
    duration,
  } = currentSong;

  const hasMetadata = album && coverImage && duration && spotifyUrl;

  return (
    <div className="text-white p-6 overflow-auto">
      <div className="text-2xl font-bold mb-6 tracking-wide">Now Playing</div>

      {hasMetadata ? (
        <div>
          <div className="relative group mb-6">
            <img
              src={coverImage}
              alt="cover"
              className="w-full h-64 rounded-xl object-cover shadow-lg transition-transform duration-300 group-hover:scale-105"
              style={{ minHeight: '16rem', maxHeight: '20rem' }}
            />
            {/* Gradient overlay at bottom */}
            <div className="absolute bottom-0 left-0 w-full h-1/3 rounded-b-xl bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-white leading-tight truncate">{title}</p>
          <p className="text-lg text-green-400 font-semibold mt-1 truncate">{artist}</p>
          <p className="text-base text-gray-400 mt-2 font-medium truncate">Album: <span className="text-white">{album}</span></p>
          <p className="text-base text-gray-400 mt-2 font-medium">Duration: <span className="text-white">{duration}</span></p>
          <div className="flex justify-center mt-8">
            <button
              onClick={() => window.open(spotifyUrl, '_blank', 'noopener,noreferrer')}
              className="flex items-center justify-center w-14 h-14 rounded-full bg-black border-2 border-green-500 shadow-lg hover:scale-110 hover:shadow-green-700/40 transition-all duration-200 group"
              title="Open in Spotify"
            >
              <img
                src="/Spotify_Primary_Logo_RGB_Green.png"
                alt="Spotify Logo"
                className="w-8 h-8"
              />
            </button>
          </div>
        </div>
      ) : (
        <div className="text-gray-400">No metadata available</div>
      )}
    </div>
  );
};

export { RightSidebar };
