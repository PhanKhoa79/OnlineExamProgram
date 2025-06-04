'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/components/providers/ThemeProvider';
import ProfileAvatar from '@/components/ui/ProfileAvatar';
import { DarkMode, LightMode, Notifications, Menu } from '@mui/icons-material';
import Image from 'next/image';
import { Sidebar } from './Sidebar';

export const Navbar = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);
  const [isClient, setIsClient] = useState(false);

  const handleLogoClick = () => {
    router.push('/dashboard');
  };

  // Client-side mounting
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Direct screen width check
  useEffect(() => {
    if (!isClient) return;
    
    const updateScreenWidth = () => {
      setScreenWidth(window.innerWidth);
    };

    updateScreenWidth();
    window.addEventListener('resize', updateScreenWidth);
    return () => window.removeEventListener('resize', updateScreenWidth);
  }, [isClient]);

  const isSmallScreen = screenWidth <= 768; // Mobile + Tablet
  
  // Auto close sidebar when screen becomes large
  useEffect(() => {
    if (!isSmallScreen && sidebarOpen) {
      setSidebarOpen(false);
    }
  }, [isSmallScreen, sidebarOpen]);

  // Prevent rendering until client-side
  if (!isClient) {
    return (
      <div className="relative px-6 py-4">
        <div className="absolute inset-0 bg-gradient-to-r from-white/50 via-indigo-50/30 to-purple-50/50 dark:from-gray-900/50 dark:via-indigo-950/30 dark:to-purple-950/50 rounded-2xl"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="h-12 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative px-6 py-4">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/50 via-indigo-50/30 to-purple-50/50 dark:from-gray-900/50 dark:via-indigo-950/30 dark:to-purple-950/50 rounded-2xl"></div>
        
        {/* Main Content */}
        <div className="relative z-10 flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Mobile/Tablet: Logo + Menu Button */}
            {isSmallScreen ? (
              <div className="flex items-center space-x-3">
                {/* Menu Button */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                  aria-label="Open menu"
                >
                  <Menu sx={{ fontSize: 24 }} />
                </button>
                
                {/* Logo */}
                <div className="flex items-center gap-2 cursor-pointer" onClick={handleLogoClick}>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full blur-lg opacity-20"></div>
                    <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-full">
                      <Image src="/logo.png" alt="Logo" width={24} height={24} className="relative z-10" />
                    </div>
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
                    MegaStar
                  </span>
                </div>
              </div>
            ) : (
              /* Desktop: Title */
              <div className="flex flex-col">
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
                  Dashboard
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  Chào mừng quay trở lại!
                </p>
              </div>
            )}
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200">
              <Notifications sx={{ fontSize: 22 }} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Theme Toggle - Only on desktop */}
            {!isSmallScreen && (
              <button
                onClick={toggleDarkMode}
                className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
                aria-label="Toggle theme"
              >
                {isDarkMode ? <LightMode sx={{ fontSize: 22 }} /> : <DarkMode sx={{ fontSize: 22 }} />}
              </button>
            )}

            {/* Profile Avatar */}
            <ProfileAvatar />
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Sidebar - Only render on small screens and when mounted */}
      {isSmallScreen && (
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
      )}
    </>
  );
};
