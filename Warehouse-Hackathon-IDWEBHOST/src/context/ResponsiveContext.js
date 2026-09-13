import React, { createContext, useContext, useState, useEffect } from 'react';
import { breakpoints } from '../styles/colors';

const ResponsiveContext = createContext();

export const ResponsiveProvider = ({ children }) => {
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setWindowDimensions({ width, height });

      // Auto close mobile/tablet drawer if expanded to desktop
      if (width >= breakpoints.tablet) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const width = windowDimensions.width;
  const height = windowDimensions.height;

  const isSmallMobile = width < 420;
  const isMobile = width < breakpoints.mobile; // < 768px
  const isTablet = width >= breakpoints.mobile && width < breakpoints.tablet; // 768px - 1023px (iPad Portrait)
  const isDesktop = width >= breakpoints.tablet; // >= 1024px

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);

  return (
    <ResponsiveContext.Provider
      value={{
        width,
        height,
        isSmallMobile,
        isMobile,
        isTablet,
        isDesktop,
        mobileMenuOpen,
        setMobileMenuOpen,
        toggleMobileMenu,
        sidebarCollapsed,
        setSidebarCollapsed,
        toggleSidebar,
      }}
    >
      {children}
    </ResponsiveContext.Provider>
  );
};

export const useResponsive = () => {
  const context = useContext(ResponsiveContext);
  if (!context) {
    throw new Error('useResponsive must be used within a ResponsiveProvider');
  }
  return context;
};
