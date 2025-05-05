'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Bell, Moon, Sun } from 'lucide-react';
import { useResponsive } from '@/hooks/useReponsiveHook';
import { useTheme } from '@/components/providers/ThemeProvider';
import SearchBar from '@/components/ui/SearchBar';
import ProfileAvatar from '@/components/ui/ProfileAvatar';
import { useState } from 'react';
import LoginModal from '@/components/modals/LoginModal';

interface NavbarProps {
  variant: 'dashboard' | 'contact';
}

export const Navbar = ({ variant }: NavbarProps) => {
  const { isLaptop, isDesktop } = useResponsive();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [showLogin, setShowLogin] = useState(false);

  if (variant === 'dashboard') {
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
                  <Moon className="text-gray-400" size={24} />
                ) : (
                  <Sun className="text-yellow-400 dark:text-white" size={24} />
                )}
              </button>
            </div>
          )}
          <Bell className="w-5 h-5 text-gray-600 dark:text-white cursor-pointer" />
          <ProfileAvatar />
        </div>
      </div>
    );
  }

  // Contact variant
  return (
    <>
      <nav className="bg-white py-4 px-6 shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Logo" width={36} height={36
              
            } />
            <span className="font-outfit text-xl font-bold">MegaStart</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/home" className="text-[#5D5A88] hover:text-[#4A3AFF] transition-colors font-dm-sans">
              Home
            </Link>
            <Link href="/about" className="text-[#5D5A88] hover:text-[#4A3AFF] transition-colors font-dm-sans">
              About
            </Link>
            <Link href="/resources" className="text-[#5D5A88] hover:text-[#4A3AFF] transition-colors font-dm-sans">
              Resources
            </Link>
            <Link href="/contact" className="text-[#4A3AFF] font-dm-sans">
              Contact
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setShowLogin(true)}
              className="px-6 py-2 text-[#4A3AFF] border border-[#4A3AFF] rounded-lg hover:bg-[#4A3AFF] hover:text-white transition-colors font-dm-sans cursor-pointer"
            >
              Login
            </button>
            <Link
              href="/register"
              className="px-6 py-2 bg-[#4A3AFF] text-white rounded-lg hover:bg-[#3929CC] transition-colors font-dm-sans"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
};
