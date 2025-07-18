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
    <div className="relative text-white p-0 overflow-hidden w-[320px] min-w-[320px] max-w-[320px] h-full flex flex-col justify-end">
      {hasMetadata && (
        <>
          {/* Background image fills sidebar */}
          <img
            src={coverImage}
            alt="cover"
            className="absolute inset-0 w-full h-full object-cover z-0"
            style={{ minHeight: '100%', minWidth: '100%' }}
          />
          {/* Gradient overlay for readability */}
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/70 to-transparent" />
        </>
      )}
      <div className="relative z-20 p-6 flex flex-col justify-end h-full">
        <div className="text-2xl font-bold mb-6 tracking-tight drop-shadow-lg">Now Playing</div>
        {hasMetadata ? (
          <>
            <p className="mt-2 text-2xl font-extrabold text-white truncate drop-shadow-lg">{title}</p>
            <p className="text-lg text-green-400 font-semibold mt-1 truncate drop-shadow-lg">{artist}</p>
            <p className="text-base text-gray-400 mt-2 font-medium truncate drop-shadow-lg">Album: <span className="text-white">{album}</span></p>
            <p className="text-base text-gray-400 mt-2 font-medium drop-shadow-lg">Duration: <span className="text-white">{duration}</span></p>
            <div className="flex justify-center mt-8">
              <button
                onClick={() => window.open(spotifyUrl, '_blank', 'noopener,noreferrer')}
                className="flex items-center justify-center rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-transparent p-0 border-none"
                title="Open in Spotify"
                style={{ width: 48, height: 48 }}
              >
                <img
                  src="/Spotify_Primary_Logo_RGB_Green.png"
                  alt="Spotify Logo"
                  className="w-12 h-12"
                  style={{ display: 'block' }}
                />
              </button>
            </div>
          </>
        ) : (
          <div className="text-gray-400">No metadata available</div>
        )}
      </div>
    </div>
  );
};

export { RightSidebar };
