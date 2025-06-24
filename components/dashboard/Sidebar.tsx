'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { SidebarItem } from './SidebarItem';
import Image from 'next/image';
import { useTheme } from '../providers/ThemeProvider';
import { ToggleSwitch } from '../ui/ToggleSwitch';
import { ManageAccounts, DarkMode, LightMode, Close, KeyboardDoubleArrowLeft, KeyboardDoubleArrowRight, PersonAdd, Groups, QuestionAnswer, AutoStories, School, SpeakerNotes, Schedule, MeetingRoom, Dashboard, BarChart } from '@mui/icons-material';
import { useAuthStore } from '@/features/auth/store';
import { hasResourcePermission } from '@/lib/permissions';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ isOpen = false, onClose }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();
  const router = useRouter();

  // Client-side mounting
  useEffect(() => {
    setIsClient(true);
  }, []);

  const permissions = useAuthStore((state) => state.permissions);

  const basePath = '/dashboard';

  const handleLogoClick = () => {
    router.push('/dashboard');
    if (onClose) onClose(); // Close mobile sidebar after navigation
  };

  type SidebarItemType = {
    title: string;
    icon: React.ReactElement;
    href: string;
  };

  const sidebarItems: SidebarItemType[] = [
    {
      title: 'Trang chủ',
      icon: <Dashboard sx={{ fontSize: 22 }} />,
      href: `${basePath}`
    },
    {
      title: 'Báo cáo & Thống kê',
      icon: <BarChart sx={{ fontSize: 22 }} />,
      href: `${basePath}/statistics`
    },
    hasResourcePermission(permissions, 'account') && {
      title: 'Quản lý tài khoản',
      icon: <PersonAdd sx={{ fontSize: 22 }} />,
      href: `${basePath}/account`
    },
    hasResourcePermission(permissions, 'role') && {
      title: 'Quản lý vai trò',
      icon: <ManageAccounts sx={{ fontSize: 22 }} />,
      href: `${basePath}/role`
    },
    hasResourcePermission(permissions, 'student') && {
      title: 'Quản lý học sinh',
      icon: <Groups sx={{ fontSize: 22 }} />,
      href: `${basePath}/student`
    },
    hasResourcePermission(permissions, 'question') && {
      title: 'Quản lý câu hỏi',
      icon: <QuestionAnswer sx={{ fontSize: 22 }} />,
      href: `${basePath}/question`
    },
    hasResourcePermission(permissions, 'question') && {
      title: 'Quản lý đề thi',
      icon: <SpeakerNotes sx={{ fontSize: 22 }} />,
      href: `${basePath}/exam`
    },
    hasResourcePermission(permissions, 'schedule') && {
      title: 'Quản lý lịch thi',
      icon: <Schedule sx={{ fontSize: 22 }} />,
      href: `${basePath}/schedule`
    },
    hasResourcePermission(permissions, 'room') && {
      title: 'Quản lý phòng thi',
      icon: <MeetingRoom sx={{ fontSize: 22 }} />,
      href: `${basePath}/room`
    },
    hasResourcePermission(permissions, 'subject') && {
      title: 'Quản lý môn học',
      icon: <AutoStories sx={{ fontSize: 22 }} />,
      href: `${basePath}/subject`
    },
    hasResourcePermission(permissions, 'class') && {
      title: 'Quản lý lớp học',
      icon: <School sx={{ fontSize: 22 }} />,
      href: `${basePath}/class`
    },
  ].filter((item): item is SidebarItemType => Boolean(item));

  // Mobile Sidebar Portal Component
  const MobileSidebar = () => {
    if (!isOpen || !isClient || typeof document === 'undefined') return null;

    return createPortal(
      <>
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden"
          style={{ zIndex: 999998 }}
          onClick={onClose}
        />

        {/* Sidebar */}
        <aside 
          className="fixed top-0 left-0 h-full p-6 text-sm flex flex-col bg-white dark:bg-gray-900 w-full sm:w-80 md:hidden"
          style={{ 
            zIndex: 999999,
            borderRight: '4px solid #6366f1',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            transform: 'translateX(0)',
            transition: 'all 0.3s ease-in-out'
          }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-3 text-gray-500 hover:text-white dark:text-gray-400 dark:hover:text-white hover:bg-red-500 dark:hover:bg-red-600 rounded-full transition-all duration-200 shadow-lg cursor-pointer"
            aria-label="Close menu"
          >
            <Close sx={{ fontSize: 24 }} />
          </button>

          {/* Logo Section */}
          <div className="mb-10 ml-2 mt-2 flex gap-3 items-center cursor-pointer group/logo" onClick={handleLogoClick}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl blur-lg opacity-20 group-hover/logo:opacity-40 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl">
                <Image src="/logo.png" alt="Logo" width={32} height={32} className="relative z-10" />
              </div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 transition-all duration-300">
              MegaStar
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-3 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
            {sidebarItems.map((item, index) => (
              <div
                key={index}
                className="transform transition-all duration-300 hover:scale-105 animate-[slideInLeft_0.6s_ease-out_forwards]"
                style={{ 
                  animationDelay: `${index * 100}ms`
                }}
              >
                <SidebarItem
                  title={item.title}
                  icon={item.icon}
                  collapsed={false}
                  openMenu={true}
                  href={item.href}
                />
              </div>
            ))}
          </nav>

          {/* Theme Toggle */}
          <div className="mt-6 pt-6 border-t-2 border-indigo-500/20 dark:border-indigo-400/20">
            <ToggleSwitch
              checked={isDarkMode}
              onChange={toggleDarkMode}
              label={isDarkMode ? 'NIGHT MODE' : 'DAY MODE'}
              icon={isDarkMode ? <DarkMode sx={{ fontSize: 16 }} /> : <LightMode sx={{ fontSize: 16 }} />}
            />
          </div>
        </aside>
      </>,
      document.body
    );
  };

  return (
    <>
      {/* Desktop Sidebar - Always visible on desktop */}
      <aside className={`
        hidden md:flex h-full p-6 text-sm flex-col
        bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-[85px]' : 'w-72'}
      `}>
        {/* Logo Section */}
        <div className="mb-10 ml-2 mt-2 flex gap-3 items-center cursor-pointer group/logo" onClick={handleLogoClick}>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl blur-lg opacity-20 group-hover/logo:opacity-40 transition-opacity duration-300"></div>
            <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl">
              <Image src="/logo.png" alt="Logo" width={32} height={32} className="relative z-10" />
            </div>
          </div>
          {!collapsed && (
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 transition-all duration-300">
              MegaStar
            </span>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="space-y-3 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {sidebarItems.map((item, index) => (
            <div
              key={index}
              className="transform transition-all duration-300 hover:scale-105 animate-[slideInLeft_0.6s_ease-out_forwards]"
              style={{ 
                animationDelay: `${index * 100}ms`
              }}
            >
              <SidebarItem
                title={item.title}
                icon={item.icon}
                collapsed={collapsed}
                openMenu={false}
                href={item.href}
              />
            </div>
          ))}
        </nav>

        {/* Desktop Collapse Button */}
        <div className="absolute top-1/2 -right-3 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center group">
          <div className="absolute inset-0 cursor-pointer"></div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border-2 border-white dark:border-gray-800 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
          >
            {collapsed ? 
              <KeyboardDoubleArrowRight sx={{ fontSize: 18 }} className="transition-transform duration-200" /> : 
              <KeyboardDoubleArrowLeft sx={{ fontSize: 18 }} className="transition-transform duration-200" />
            }
          </button>
          <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 delay-200 pointer-events-none whitespace-nowrap z-50 shadow-xl">
            {collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
            <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-gray-100"></div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Portal */}
      <MobileSidebar />
    </>
  );
};
