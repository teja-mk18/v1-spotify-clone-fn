import { createContext, useContext, useState } from "react";

const SidebarToggleContext = createContext();

export const SidebarToggleProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <SidebarToggleContext.Provider
      value={{
        isSidebarOpen,
        toggleSidebar,
        openSidebar,
        closeSidebar,
        setSidebarOpen: setIsSidebarOpen, // <-- FIXED
      }}
    >
      {children}
    </SidebarToggleContext.Provider>
  );
};

export const useSidebarToggle = () => useContext(SidebarToggleContext);
