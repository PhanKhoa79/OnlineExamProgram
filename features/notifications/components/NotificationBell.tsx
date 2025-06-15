'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Bell } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import NotificationPanel from './NotificationPanel';

export default function NotificationBell() {
  const { unreadCount } = useNotifications();
  
  const [isOpen, setIsOpen] = useState(false);
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const togglePanel = (event: React.MouseEvent) => {
    if (!isOpen) {
      const rect = event.currentTarget.getBoundingClientRect();
      setButtonRect(rect);
    }
    setIsOpen(!isOpen);
  };

  const closePanel = () => {
    setIsOpen(false);
    setButtonRect(null);
  };

  // Portal content
  const panelContent = isOpen && buttonRect && mounted ? (
    <div
      className="fixed inset-0 z-[9999]"
      style={{ zIndex: 9999 }}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/10"
        onClick={closePanel}
      />
      
      {/* Panel positioned relative to button */}
      <div 
        className="absolute w-80 md:w-96 animate-fadeIn"
        style={{
          top: buttonRect.bottom + 8,
          right: window.innerWidth - buttonRect.right,
          zIndex: 10000
        }}
      >
        <NotificationPanel onClose={closePanel} />
      </div>
    </div>
  ) : null;

  return (
    <div className="relative">
      <button
        onClick={togglePanel}
        className="relative p-2 mt-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-full focus:outline-none transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform bg-red-500 rounded-full min-w-[20px] h-5">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Portal Panel */}
      {mounted && typeof window !== 'undefined' && createPortal(panelContent, document.body)}
    </div>
  );
} 