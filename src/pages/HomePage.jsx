import { Sidebar } from "../components/sidebar";
import { MainContent } from "../components/maincontent";
import { RightSidebar } from "../components/rightsidebar";
import { BottomPlayer } from "../components/bottomplayer";
import { Navbar } from "../components/navbar";
import { useSidebarToggle } from "../contexts/SidebarToggleContext";

const HomePage = () => {
  const { isSidebarOpen } = useSidebarToggle();

  return (
    <div className="h-screen w-screen flex flex-col bg-black">
      <Navbar />
      <div className="flex flex-1 items-start px-0 py-4 overflow-hidden">
        {/* Left Sidebar */}
        <div className="bg-[#181818] border-r border-b border-neutral-800 mx-2 min-w-[200px] max-w-[250px] h-[calc(100vh-5rem-5rem)] rounded-lg z-20 relative mb-4">
          <Sidebar />
        </div>
        {/* Main Content */}
        <div className="flex-1 mx-2 h-[calc(100vh-5rem-5rem)] bg-[#181818] border-b border-neutral-800 rounded-lg border border-neutral-800 shadow z-10 relative mb-4">
          <MainContent />
        </div>
        {/* Right Sidebar */}
        {isSidebarOpen && (
          <div className="bg-[#181818] border-l border-b border-neutral-800 mx-2 min-w-[260px] max-w-[320px] h-[calc(100vh-5rem-5rem)] rounded-lg z-20 relative mb-4">
            <RightSidebar isOpen={isSidebarOpen} />
          </div>
        )}
      </div>
      <BottomPlayer />
    </div>
  );
};

export { HomePage };
