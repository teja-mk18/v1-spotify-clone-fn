import { Route, Routes, BrowserRouter } from "react-router-dom";
import { useAppContext } from "./contexts/appContext";
import { BounceLoader } from "react-spinners";
import { SignupPage } from "./pages/SignupPage";
import { LoginPage } from "./pages/LoginPage";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { UploadPage } from "./pages/UploadPage";
import { PlayerProvider } from "./contexts/PlayerContext"; // ✅ import your PlayerProvider
import { SidebarToggleProvider } from "./contexts/SidebarToggleContext";
import { PlaylistProvider } from "./contexts/PlaylistContext";

const App = () => {
  const { appLoading, user } = useAppContext();
  const { isAuthenticated } = user;

  if (appLoading) {
    return (
      <div className="min-h-[100vh] flex flex-col items-center justify-center gap-10 content-center">
        <BounceLoader size="175px" color="#2020ff" />
        <div className="border-1 border-lime-800 p-8 rounded-lg">
          <p>Please note:</p>
          <p>Backend is hosted on free server</p>
          <p>It may take upto 2 minutes to warm up (for the first time)!</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <PlaylistProvider>
        <PlayerProvider> {/* ✅ wrap all routes with PlayerProvider */}
          <SidebarToggleProvider>
            <Routes>
              {!isAuthenticated ? (
                <>
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="*" element={<LoginPage />} />
                </>
              ) : (
                <>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/signup" element={<HomePage />} />
                  <Route path="/login" element={<HomePage />} />
                  <Route path="/upload" element={<UploadPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </>
              )}
            </Routes>
          </SidebarToggleProvider>
        </PlayerProvider>
      </PlaylistProvider>
    </BrowserRouter>
  );
};

export default App;
