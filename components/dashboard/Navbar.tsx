'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/components/providers/ThemeProvider';
import ProfileAvatar from '@/components/ui/ProfileAvatar';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import NotificationBell from '@/features/notifications/components/NotificationBell';

export const Navbar = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const router = useRouter();
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
  const isMobile = screenWidth <= 480; // Mobile only

  // Prevent rendering until client-side
  if (!isClient) {
    return (
      <div className="relative px-4 md:px-6 py-3 md:py-4">
        {/* Glass Background with Enhanced Border */}
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border-2 border-white/30 dark:border-gray-700/30 shadow-xl shadow-indigo-500/10 dark:shadow-purple-500/10"></div>
        
        {/* Gradient Border Effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 p-[2px]">
          <div className="h-full w-full rounded-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl"></div>
        </div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="h-10 md:h-12 w-32 md:w-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="h-8 w-8 md:h-10 md:w-10 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
            <div className="h-8 w-8 md:h-10 md:w-10 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
            <div className="h-8 w-8 md:h-10 md:w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative px-4 md:px-6 py-3 md:py-4">
      {/* Enhanced Glass Background with Beautiful Border */}
      <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border-2 border-white/30 dark:border-gray-700/30 shadow-xl shadow-indigo-500/10 dark:shadow-purple-500/10"></div>
      
      {/* Gradient Border Effect */}
      <div className="absolute inset-0 rounded-2xl p-[2px]" style={{ background: `linear-gradient(to right, var(--color-primary, #4f46e5), var(--color-secondary, #9333ea), var(--color-accent, #ec4899))`, opacity: 0.2 }}>
        <div className="h-full w-full rounded-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl"></div>
      </div>
      
      {/* Subtle Inner Glow */}
      <div className="absolute inset-0 rounded-2xl" style={{ background: `linear-gradient(to right, var(--color-primary-50, #eef2ff), var(--color-primary-100, #e0e7ff), var(--color-primary-50, #eef2ff))`, opacity: 0.5 }}></div>
      
      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-2 md:space-x-4 min-w-0 flex-1">
          {/* Mobile/Tablet: Logo Only */}
          {isSmallScreen ? (
            <div className="flex items-center gap-2 md:gap-3 cursor-pointer group min-w-0" onClick={handleLogoClick}>
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300" style={{ background: `linear-gradient(135deg, var(--color-primary, #4f46e5), var(--color-secondary, #9333ea))` }}></div>
                <div className="relative p-2 md:p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300" style={{ background: `linear-gradient(135deg, var(--color-primary, #4f46e5), var(--color-secondary, #9333ea))` }}>
                  <Image src="/logo.png" alt="Logo" width={isMobile ? 20 : 24} height={isMobile ? 20 : 24} className="relative z-10" />
                </div>
              </div>
              <span className="text-lg md:text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300 truncate" style={{ backgroundImage: `linear-gradient(to right, var(--color-primary, #4f46e5), var(--color-secondary, #9333ea), var(--color-accent, #ec4899))` }}>
                MegaStar
              </span>
            </div>
          ) : (
            /* Desktop: Title */
            <div className="flex flex-col min-w-0">
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent truncate" style={{ backgroundImage: `linear-gradient(to right, var(--color-primary, #4f46e5), var(--color-secondary, #9333ea), var(--color-accent, #ec4899))` }}>
                Dashboard
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium truncate">
                Chào mừng quay trở lại!
              </p>
            </div>
          )}
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-2 md:space-x-3 flex-shrink-0">
          {/* Enhanced Notifications */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative bg-gray-100/50 dark:bg-gray-800/50 p-2 md:p-3 rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-300 shadow-sm hover:shadow-lg">
              <div className="scale-90 md:scale-100">
                <NotificationBell />
              </div>
            </div>
          </div>

          {/* Enhanced Theme Toggle - Show on all screen sizes */}
          <button
            onClick={toggleDarkMode}
            className="group relative p-2 md:p-3 text-gray-600 hover:text-white dark:text-gray-300 dark:hover:text-white bg-gray-100/50 hover:bg-gradient-to-br hover:from-indigo-500 hover:to-purple-600 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-300 shadow-sm hover:shadow-lg hover:scale-105"
            aria-label="Toggle theme"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            {isDarkMode ? (
              <SunIcon className="w-4 h-4 md:w-5 md:h-5 relative z-10 text-yellow-500 group-hover:text-white transition-colors duration-300" />
            ) : (
              <MoonIcon className="w-4 h-4 md:w-5 md:h-5 relative z-10 text-indigo-600 group-hover:text-white transition-colors duration-300" />
            )}
          </button>

          {/* Enhanced Profile Avatar */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"></div>
            <div className="relative border-2 border-gray-200/50 dark:border-gray-700/50 hover:border-indigo-300 dark:hover:border-indigo-600 rounded-full transition-all duration-300 shadow-sm hover:shadow-lg scale-90 md:scale-100">
              <ProfileAvatar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
