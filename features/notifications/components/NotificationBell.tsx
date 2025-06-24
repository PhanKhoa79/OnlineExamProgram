'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Bell } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import NotificationPanel from './NotificationPanel';

export default function NotificationBell() {
  const { unreadCount, lastEventTime, loadNotifications } = useNotifications();
  
  const [isOpen, setIsOpen] = useState(false);
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);
  const [mounted, setMounted] = useState(false);
  const [animateBadge, setAnimateBadge] = useState(false);
  const prevUnreadCount = useRef(unreadCount);
  const prevLastEventTime = useRef(lastEventTime);

  // Thiết lập mounted state khi component được render
  useEffect(() => {
    setMounted(true);
    
    // Tải thông báo khi component được mount
    loadNotifications();
  }, [loadNotifications]);

  // Hiệu ứng khi có thông báo mới
  useEffect(() => {
    // Nếu số lượng thông báo chưa đọc tăng lên, kích hoạt hiệu ứng
    if (unreadCount > prevUnreadCount.current) {
      setAnimateBadge(true);
      
      // Tắt hiệu ứng sau 2 giây
      const timer = setTimeout(() => {
        setAnimateBadge(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
    
    // Cập nhật giá trị tham chiếu
    prevUnreadCount.current = unreadCount;
  }, [unreadCount, lastEventTime]);

  // Làm mới thông báo khi có sự kiện mới
  useEffect(() => {
    if (lastEventTime > 0 && lastEventTime !== prevLastEventTime.current) {
      console.log('🔔 New notification event detected, refreshing badge...');
      
      // Tải lại thông báo khi có sự kiện mới
      loadNotifications();
      
      // Kích hoạt hiệu ứng cho badge
      setAnimateBadge(true);
      
      // Tắt hiệu ứng sau 2 giây
      const timer = setTimeout(() => {
        setAnimateBadge(false);
      }, 2000);
      
      // Cập nhật giá trị tham chiếu
      prevLastEventTime.current = lastEventTime;
      
      return () => clearTimeout(timer);
    }
  }, [lastEventTime, loadNotifications]);

  const togglePanel = (event: React.MouseEvent) => {
    if (!isOpen) {
      const rect = event.currentTarget.getBoundingClientRect();
      setButtonRect(rect);
      
      // Tải lại thông báo khi mở panel
      loadNotifications();
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
        className="relative flex items-center justify-center text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-full focus:outline-none transition-colors"
        aria-label="Notifications"
      >
        <Bell className={`h-5 w-5 ${animateBadge ? 'animate-ping-once' : ''}`} />
        {unreadCount > 0 && (
          <span 
            className={`absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform bg-red-500 rounded-full min-w-[18px] h-4 ${animateBadge ? 'animate-pulse' : ''}`}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Portal Panel */}
      {mounted && typeof window !== 'undefined' && createPortal(panelContent, document.body)}
    </div>
  );
} 