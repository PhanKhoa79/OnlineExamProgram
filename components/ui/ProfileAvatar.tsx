'use client'

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Avatar } from '@mui/material';
import { ArrowDropDown } from '@mui/icons-material';
import { ExitToApp } from '@mui/icons-material';
import { logout } from '@/features/auth/services/authService'; 
import { useAuthStore } from '@/features/auth/store';

export default function ProfileAvatar() {
  const [isOpen, setIsOpen] = useState(false);
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);
  const [mounted, setMounted] = useState(false);
  const { clearAuthInfo } = useAuthStore.getState();

  const role = useAuthStore.getState().user?.role.name;
  const accountName = useAuthStore.getState().user?.accountname;
  const urlAvatar = useAuthStore.getState().user?.urlAvatar;

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleDropdown = (event: React.MouseEvent) => {
    if (!isOpen) {
      const rect = event.currentTarget.getBoundingClientRect();
      setButtonRect(rect);
    }
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
    setButtonRect(null);
  };

  const handleLogout = async () => {
    try {
      await logout();      
      clearAuthInfo();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Portal content
  const dropdownContent = isOpen && buttonRect && mounted ? (
    <div
      className="fixed inset-0 z-[9999]"
      style={{ zIndex: 9999 }}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/10"
        onClick={closeDropdown}
      />
      
      {/* Dropdown positioned relative to button */}
      <div 
        className="absolute w-72 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-2xl overflow-hidden animate-fadeIn"
        style={{
          top: buttonRect.bottom + 8,
          right: window.innerWidth - buttonRect.right,
          zIndex: 10000
        }}
      >
        {/* Header */}
        <div className="px-4 py-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/50 dark:to-purple-950/50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar 
                alt="Avatar" 
                src={urlAvatar || "/avatar.png"} 
                sx={{ width: 48, height: 48 }}
                className="ring-2 ring-indigo-200 dark:ring-indigo-800"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white text-base">
                {accountName || 'User Name'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                {role || 'User'}
              </p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-2">
          {/* Logout */}
          <div 
            className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 group"
            onClick={handleLogout}
          >
            <div className="p-2 rounded-xl bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform duration-200">
              <ExitToApp sx={{ fontSize: 20 }} />
            </div>
            <div>
              <span className="font-medium text-red-600 dark:text-red-400">Đăng xuất</span>
              <p className="text-xs text-red-500/70 dark:text-red-400/70">Thoát khỏi tài khoản</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className="relative">
      {/* Profile Button */}
      <div 
        className="flex items-center gap-2 cursor-pointer p-2 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 hover:scale-105 shadow-lg group" 
        onClick={toggleDropdown}
      >
        <div className="relative">
          <Avatar 
            alt="Avatar" 
            src={urlAvatar} 
            sx={{ width: 40, height: 40 }}
            className="ring-2 ring-white/20 dark:ring-gray-700/30"
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
        </div>
        
        <div className="hidden md:block">
          <div className="flex items-center gap-1">
            <ArrowDropDown 
              className={`text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`} 
              sx={{ fontSize: 20 }}
            />
          </div>
        </div>
      </div>

      {/* Portal Dropdown */}
      {mounted && typeof window !== 'undefined' && createPortal(dropdownContent, document.body)}
    </div>
  );
}
