'use client';

import { SidebarItem } from './SidebarItem';
import Image from 'next/image';
import { useResponsive } from '@/hooks/useReponsiveHook';
import { useState } from 'react';
import { useTheme } from '../providers/ThemeProvider';
import { ToggleSwitch } from '../ui/ToggleSwitch';
import {
  LayoutDashboard,
  ShoppingCart,
  Folder,
  FileText,
  Building,
  Newspaper,
  MessageCircle,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';

export const Sidebar = () => {
  const { isMobile, isTablet } = useResponsive();
  const [isOpen, setIsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();
  const showText = (isMobile || isTablet) ? isOpen : !collapsed;
  const toggleSidebar = () => setIsOpen(!isOpen);

  const buildSidebarItems = (basePath: string) => [
    { title: "Overview", icon: <LayoutDashboard size={22} />, path: "" },
    { title: "eCommerce", icon: <ShoppingCart size={22} />, path: "h" },
    { title: "Projects", icon: <Folder size={22} />, path: "h" },
    { title: "Account", icon: <FileText size={22} />, path: "h" },
    { title: "Corporate", icon: <Building size={22} />, path: "h" },
    { title: "Blog", icon: <Newspaper size={22} />, path: "h" },
    { title: "Social", icon: <MessageCircle size={22} />, path: "h" },
  ].map(({ path, ...rest }) => ({
    ...rest,
    href: path ? `${basePath}/${path}` : basePath,
  }));
  
  const sidebarItems = buildSidebarItems('/dashboard');

  return (
    <>
      {/* Mobile Menu Button */}
      {(isMobile || isTablet) && !isOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed bottom-4 left-4 z-50 md:hidden bg-white p-2 rounded-lg shadow-lg hover:bg-blue-600 hover:text-white cursor-pointer"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Sidebar */}
      <aside 
        className={`
          group
          fixed inset-0 z-40 p-4 text-sm flex flex-col transition-all duration-300 ease-in-out
          bg-white dark:bg-[var(--dark-bg)]
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isTablet &&  'w-64' }
          ${isMobile ? 'w-full' : ''}
          md:translate-x-0 md:min-w-[80px] md:relative md:inset-auto
           ${!isMobile && !isTablet && collapsed ? 'md:w-[80px]' : 'md:w-64'}
        `}
      >
        <div className="flex flex-col h-full relative">
          {/* Logo */}
          <div className="text-xl font-bold mb-8 ml-1.5 mt-1.5 flex gap-1.5 items-center cursor-pointer">
            <Image src="/logo.png" alt="Logo" width={30} height={30} />
            {!collapsed && <span className="text-gray-900 dark:text-white">MegaStar</span>}
          </div>

          {/* Sidebar Items */}
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

            {/* Toggle Theme */}
            {(isMobile || isTablet) && (
              <ToggleSwitch
                checked={isDarkMode}
                onChange={toggleDarkMode}
                label={isDarkMode ? "NIGHT MODE" : "DAY MODE"}
                icon={isDarkMode ? <Moon size={16} /> : <Sun size={16} />}
              />
            )}
          </ul>

          {/* Log Out */}
          <button
            className="flex items-center mt-4 gap-2 px-3 py-2 text-base font-normal text-red-500 hover:bg-red-100 dark:hover:bg-white hover:font-semibold rounded-xl w-full cursor-pointer"
          >
            <LogOut size={22} />
            {showText && "Log Out"}
          </button>

          {/* Hover toggle collapse button */}
          {!isMobile && !isTablet && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="absolute top-1/2 -right-7 transform -translate-y-1/2 bg-blue-500 dark:bg-white text-white dark:text-gray-800 p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
            </button>
          )}

          {/* Close on mobile */}
          {(isMobile || isTablet) && isOpen && (
            <button
              onClick={toggleSidebar}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          )}
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};
