'use client';

import { useResponsive } from '@/hooks/useReponsiveHook';
import { useTheme } from '@/components/providers/ThemeProvider';
import SearchBar from '@/components/ui/SearchBar';
import ProfileAvatar from '@/components/ui/ProfileAvatar';
import { DarkMode, LightMode, Notifications } from '@mui/icons-material';


export const Navbar = () => {
  const { isLaptop, isDesktop } = useResponsive();
  const { isDarkMode, toggleDarkMode } = useTheme();

    return (
      <div className="flex items-center justify-between px-6 py-3 bg-white dark:bg-[var(--dark-bg)]">
        <div className="flex items-center space-x-2 text-zinc-700 dark:text-white">
          <span className="text-2xl font-semibold text-slate-900 dark:text-white">Dashboard</span>
        </div>

        <div className="flex items-center gap-8">
          {(isLaptop || isDesktop) && (
            <div className="flex items-center space-x-4">
              {isDesktop && (
                <div className="relative w-72">
                  <SearchBar />
                </div>
              )}

              <button onClick={toggleDarkMode} className="cursor-pointer">
                {isDarkMode ? (
                  <DarkMode className="text-gray-400" sx={{ fontSize: 24}} />
                ) : (
                  <LightMode className="text-yellow-400 dark:text-white" sx={{ fontSize: 24}} />
                )}
              </button>
            </div>
          )}
          <Notifications className="w-5 h-5 text-gray-600 dark:text-white cursor-pointer" />
          <ProfileAvatar />
        </div>
      </div>
    );
}
