'use client';

import React, { useState } from 'react';
import { SidebarItem } from './SidebarItem';
import Image from 'next/image';
import { useResponsive } from '@/hooks/useReponsiveHook';
import { useTheme } from '../providers/ThemeProvider';
import { ToggleSwitch } from '../ui/ToggleSwitch';
import { ManageAccounts,  DarkMode, LightMode, Menu, Close, Dashboard, KeyboardDoubleArrowLeft, KeyboardDoubleArrowRight }  from '@mui/icons-material';


interface SidebarProps {
  role: string | undefined;
}

export const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const { isMobile, isTablet } = useResponsive();
  const [isOpen, setIsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const buildSidebarItems = (basePath: string) => {
    if (role === 'admin') {
      return [
        { title: 'Quản lý tài khoản', icon: <ManageAccounts sx={{ fontSize: 22 }} />, path: 'account' },
      ];
    }

    if (role === 'teacher') {
      return [
        { title: 'Overview', icon: <Dashboard sx={{ fontSize: 22 }} />, path: '' },
      ];
    }

    return [];
  };

  const sidebarItems = buildSidebarItems('/dashboard').map(({ path, ...rest }) => ({
    ...rest,
    href: path ? `/dashboard/${path}` : '/dashboard',
  }));

  return (
    <>
      {(isMobile || isTablet) && !isOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed bottom-4 left-4 z-50 md:hidden bg-white p-2 rounded-lg shadow-lg hover:bg-blue-600 hover:text-white cursor-pointer"
          aria-label="Open menu"
        >
          <Menu sx={{ fontSize: 24 }} />
        </button>
      )}

      <aside
        className={`
          group fixed inset-0 z-40 p-4 text-sm flex flex-col transition-all duration-300 ease-in-out
          bg-white dark:bg-[var(--dark-bg)]
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isTablet && 'w-64'}
          ${isMobile ? 'w-full' : ''}
          md:translate-x-0 md:min-w-[80px] md:relative md:inset-auto
          ${!isMobile && !isTablet && collapsed ? 'md:w-[80px]' : 'md:w-64'}
        `}
      >
        <div className="flex flex-col h-full relative">
          <div className="text-xl font-bold mb-8 ml-1.5 mt-1.5 flex gap-1.5 items-center cursor-pointer">
            <Image src="/logo.png" alt="Logo" width={30} height={30} />
            {!collapsed && <span className="text-gray-900 dark:text-white">MegaStar</span>}
          </div>

          <ul className="space-y-4 flex-1">
            {sidebarItems.map((item, index) => (
              <SidebarItem
                key={index}
                title={item.title}
                icon={item.icon}
                collapsed={collapsed}
                openMenu={isOpen}
                href={item.href}
              />
            ))}

            {(isMobile || isTablet) && (
              <ToggleSwitch
                checked={isDarkMode}
                onChange={toggleDarkMode}
                label={isDarkMode ? 'NIGHT MODE' : 'DAY MODE'}
                icon={isDarkMode ? <DarkMode sx={{ fontSize: 16 }} /> : <LightMode sx={{ fontSize: 16 }} />}
              />
            )}
          </ul>

          {!isMobile && !isTablet && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="absolute top-1/2 -right-7 transform -translate-y-1/2 bg-blue-500 dark:bg-white text-white dark:text-gray-800 p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {collapsed ? <KeyboardDoubleArrowRight sx={{ fontSize: 18 }} /> : <KeyboardDoubleArrowLeft sx={{ fontSize: 18 }} /> }
            </button>
          )}

          {(isMobile || isTablet) && isOpen && (
            <button
              onClick={toggleSidebar}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
              aria-label="Close menu"
            >
              <Close  sx={{ fontSize: 24 }} />
            </button>
          )}
        </div>
      </aside>

      {isOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={toggleSidebar} />}
    </>
  );
};
