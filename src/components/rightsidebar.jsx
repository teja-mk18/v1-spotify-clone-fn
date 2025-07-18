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
    <div className="text-white p-4 overflow-auto">
      <div className="text-xl font-semibold mb-4">Now Playing</div>

      {hasMetadata ? (
        <div>
          <img
            src={coverImage}
            alt="cover"
            className="w-full h-auto rounded object-cover"
          />
          <p className="mt-2 font-bold">{title}</p>
          <p className="text-sm text-gray-400">Artist: {artist}</p>
          <p className="text-sm text-gray-500 mt-2">Album: {album}</p>
          <p className="text-sm text-gray-400 mt-2">Duration: {duration}</p>
          <button
            onClick={() => window.open(spotifyUrl, '_blank', 'noopener,noreferrer')}
            className="mt-4 flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
          >
            <img
              src="/Spotify_Primary_Logo_RGB_Green.png"
              alt="Spotify Logo"
              className="w-6 h-6 mr-2"
            />
          </button>
        </div>
      ) : (
        <div className="text-gray-400">No metadata available</div>
      )}
    </div>
  );
};

export { RightSidebar };
