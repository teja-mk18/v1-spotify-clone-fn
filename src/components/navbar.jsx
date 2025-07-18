import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/appContext";
import { axiosInstance } from "../axios/axiosInstance";
import { usePlaylist } from "../contexts/PlaylistContext";

const Navbar = () => {
  const { user = {} } = useAppContext();
  const { isAuthenticated } = user;
  const { setSelectedPlaylist } = usePlaylist();

  const handleLogout = async () => {
    try {
      await axiosInstance.get("/auth/logout");
      window.location.reload();
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleHomeClick = () => {
    setSelectedPlaylist(null);
  };

  return (
    <div className="w-full h-16 flex items-center justify-between px-6 bg-black text-white">
      {/* Logo or Brand */}
      <Link to="/" className="text-xl font-bold text-white flex items-center gap-2" onClick={handleHomeClick}>
        <img src="/Spotify_Primary_Logo_RGB_Green.png" alt="Spotify Logo" className="h-7 w-auto" />
        Spotify Clone
      </Link>

      {/* Home Button (centered) */}
      <div className="flex-1 flex justify-center">
        <Link
          to="/"
          onClick={handleHomeClick}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-black hover:bg-zinc-800 transition duration-200 shadow-lg border border-zinc-700"
        >
          {/* Improved Home Icon SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
            <path d="M3 12L12 5l9 7" />
            <path d="M5 10v9a1 1 0 0 0 1 1h4v-5h4v5h4a1 1 0 0 0 1-1v-9" />
          </svg>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex gap-6 items-center text-sm font-medium">
        {/* Remove old Home link since we have a new Home button */}
        {/*
        <Link to="/" className="hover:text-green-400 transition duration-200" onClick={handleHomeClick}>
          Home
        </Link>
        */}

        {isAuthenticated && (
          <Link
            to="/upload"
            className="hover:text-green-400 transition duration-200"
          >
            Upload
          </Link>
        )}

        {!isAuthenticated ? (
          <>
            <Link
              to="/login"
              className="text-zinc-300 hover:text-white transition duration-200"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-zinc-300 hover:text-white transition duration-200"
            >
              Signup
            </Link>
          </>
        ) : (
          <>
            <button
              onClick={handleLogout}
              className="px-3 py-1 rounded-full text-sm font-medium bg-zinc-800 hover:bg-zinc-700 transition duration-200"
            >
              Logout
            </button>
            <span className="text-zinc-400 text-xs">{user?.email}</span>
          </>
        )}
      </div>
    </div>
  );
};

export { Navbar };
