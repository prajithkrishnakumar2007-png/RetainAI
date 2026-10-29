import React, { createContext, useContext, useState } from 'react';

const LayoutContext = createContext({
  sidebarCollapsed: false,
  setSidebarCollapsed: () => {},
  mobileOpen: false,
  setMobileOpen: () => {},
  toggleSidebar: () => {},
  toggleMobile: () => {},
});

export function LayoutProvider({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);
  const toggleMobile = () => setMobileOpen((prev) => !prev);

  return (
    <LayoutContext.Provider
      value={{
        sidebarCollapsed,
        setSidebarCollapsed,
        mobileOpen,
        setMobileOpen,
        toggleSidebar,
        toggleMobile,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  return useContext(LayoutContext);
}
