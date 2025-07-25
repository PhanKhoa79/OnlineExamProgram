'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { Dashboard, PersonAdd, ManageAccounts, Groups, QuestionAnswer, SpeakerNotes, Schedule, MeetingRoom, AutoStories, School, Settings, BarChart, Assessment } from '@mui/icons-material';
import { useAuthStore } from '@/features/auth/store';
import { hasResourcePermission } from '@/lib/permissions';

interface MenuItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactElement;
  href: string;
  keywords: string[];
  category: string;
}

interface Position {
  x: number;
  y: number;
}

export const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [position, setPosition] = useState<Position>({ x: 24, y: 24 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const permissions = useAuthStore((state) => state.permissions);

  // Get responsive position based on screen size
  const getResponsivePosition = (): Position => {
    if (typeof window === 'undefined') return { x: 24, y: 24 };
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // For mobile devices (< 768px)
    if (viewportWidth < 768) {
      return {
        x: 16, // 16px from left
        y: viewportHeight - 80 // 80px from bottom
      };
    }
    
    // For tablet devices (768px - 1024px)
    if (viewportWidth < 1024) {
      return {
        x: 20,
        y: viewportHeight - 90
      };
    }
    
    // For desktop (>= 1024px)
    return {
      x: 24,
      y: viewportHeight - 100
    };
  };

  // Validate and constrain position to viewport
  const constrainPosition = (pos: Position): Position => {
    if (typeof window === 'undefined') return pos;
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const triggerWidth = triggerRef.current?.offsetWidth || (window.innerWidth < 768 ? 180 : 220);
    const triggerHeight = triggerRef.current?.offsetHeight || 50;
    
    const constrainedX = Math.max(16, Math.min(pos.x, viewportWidth - triggerWidth - 16));
    const constrainedY = Math.max(16, Math.min(pos.y, viewportHeight - triggerHeight - 16));
    
    return { x: constrainedX, y: constrainedY };
  };

  // Client-side mounting
  useEffect(() => {
    setIsClient(true);
    
    // Set responsive position on mount
    const responsivePosition = getResponsivePosition();
    setPosition(responsivePosition);
    
    // Load saved position from localStorage if exists and is valid
    const savedPosition = localStorage.getItem('commandPalettePosition');
    if (savedPosition) {
      try {
        const parsed = JSON.parse(savedPosition);
        // Check if saved position is still valid for current screen size
        const constrainedPos = constrainPosition(parsed);
        // If position had to be significantly adjusted, use responsive default
        const xDiff = Math.abs(constrainedPos.x - parsed.x);
        const yDiff = Math.abs(constrainedPos.y - parsed.y);
        if (xDiff > 50 || yDiff > 50) {
          setPosition(responsivePosition);
        } else {
          setPosition(constrainedPos);
        }
      } catch {
        console.warn('Failed to parse saved position, using responsive default');
        setPosition(responsivePosition);
      }
    }
  }, []);

  // Handle window resize to reposition trigger
  useEffect(() => {
    const handleResize = () => {
      setPosition(prevPosition => constrainPosition(prevPosition));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Save position to localStorage
  const savePosition = useCallback((newPosition: Position) => {
    const constrainedPos = constrainPosition(newPosition);
    localStorage.setItem('commandPalettePosition', JSON.stringify(constrainedPos));
    setPosition(constrainedPos);
  }, []); // Empty dependency array since constrainPosition doesn't depend on state

  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!triggerRef.current) return;
    
    const rect = triggerRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    setDragOffset({ x: offsetX, y: offsetY });
    setIsDragging(true);
    
    // Prevent text selection during drag
    e.preventDefault();
  };

  // Handle mouse move for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      const constrainedPos = constrainPosition({ x: newX, y: newY });
      setPosition(constrainedPos);
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        savePosition(position);
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none'; // Prevent text selection
      document.body.style.cursor = 'grabbing';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isDragging, dragOffset, position, savePosition]);

  // Build menu items based on permissions
  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      title: 'Trang chủ',
      description: 'Xem tổng quan hệ thống và thống kê',
      icon: <Dashboard className="w-5 h-5" />,
      href: '/dashboard',
      keywords: ['dashboard', 'trang chủ', 'home', 'overview', 'tổng quan'],
      category: 'Điều hướng'
    },
    {
      id: 'statistics',
      title: 'Báo cáo & Thống kê',
      description: 'Xem báo cáo chi tiết và phân tích kết quả thi',
      icon: <BarChart className="w-5 h-5" />,
      href: '/dashboard/statistics',
      keywords: ['statistics', 'thống kê', 'báo cáo', 'reports', 'analytics', 'phân tích', 'kết quả', 'biểu đồ', 'chart'],
      category: 'Phân tích'
    },
    {
      id: 'exam-results',
      title: 'Kết quả thi',
      description: 'Xem chi tiết kết quả thi của sinh viên',
      icon: <Assessment className="w-5 h-5" />,
      href: '/dashboard/exam-results',
      keywords: ['exam-results', 'kết quả thi', 'điểm số', 'grade', 'score', 'results', 'sinh viên', 'student'],
      category: 'Phân tích'
    },
    ...(hasResourcePermission(permissions, 'account') ? [{
      id: 'account',
      title: 'Quản lý tài khoản',
      description: 'Tạo, chỉnh sửa và quản lý tài khoản người dùng',
      icon: <PersonAdd className="w-5 h-5" />,
      href: '/dashboard/account',
      keywords: ['account', 'tài khoản', 'user', 'người dùng', 'quản lý'],
      category: 'Quản lý'
    }] : []),
    ...(hasResourcePermission(permissions, 'role') ? [{
      id: 'role',
      title: 'Quản lý vai trò',
      description: 'Cấu hình vai trò và phân quyền hệ thống',
      icon: <ManageAccounts className="w-5 h-5" />,
      href: '/dashboard/role',
      keywords: ['role', 'vai trò', 'permission', 'phân quyền', 'quản lý'],
      category: 'Quản lý'
    }] : []),
    ...(hasResourcePermission(permissions, 'student') ? [{
      id: 'student',
      title: 'Quản lý học sinh',
      description: 'Quản lý thông tin và danh sách học sinh',
      icon: <Groups className="w-5 h-5" />,
      href: '/dashboard/student',
      keywords: ['student', 'học sinh', 'sinh viên', 'quản lý'],
      category: 'Học tập'
    }] : []),
    ...(hasResourcePermission(permissions, 'question') ? [{
      id: 'question',
      title: 'Quản lý câu hỏi',
      description: 'Tạo và quản lý ngân hàng câu hỏi',
      icon: <QuestionAnswer className="w-5 h-5" />,
      href: '/dashboard/question',
      keywords: ['question', 'câu hỏi', 'quiz', 'ngân hàng', 'bank'],
      category: 'Nội dung'
    }] : []),
    ...(hasResourcePermission(permissions, 'exam') ? [{
      id: 'exam',
      title: 'Quản lý đề thi',
      description: 'Tạo và quản lý các đề thi, bài kiểm tra',
      icon: <SpeakerNotes className="w-5 h-5" />,
      href: '/dashboard/exam',
      keywords: ['exam', 'đề thi', 'bài thi', 'kiểm tra', 'test'],
      category: 'Nội dung'
    }] : []),
    ...(hasResourcePermission(permissions, 'schedule') ? [{
      id: 'schedule',
      title: 'Quản lý lịch thi',
      description: 'Lập lịch và quản lý thời gian thi',
      icon: <Schedule className="w-5 h-5" />,
      href: '/dashboard/schedule',
      keywords: ['schedule', 'lịch thi', 'thời gian', 'calendar'],
      category: 'Lập lịch'
    }] : []),
    ...(hasResourcePermission(permissions, 'room') ? [{
      id: 'room',
      title: 'Quản lý phòng thi',
      description: 'Cấu hình và quản lý phòng thi',
      icon: <MeetingRoom className="w-5 h-5" />,
      href: '/dashboard/room',
      keywords: ['room', 'phòng thi', 'classroom', 'phòng học'],
      category: 'Cơ sở vật chất'
    }] : []),
    ...(hasResourcePermission(permissions, 'subject') ? [{
      id: 'subject',
      title: 'Quản lý môn học',
      description: 'Quản lý danh sách môn học và chương trình',
      icon: <AutoStories className="w-5 h-5" />,
      href: '/dashboard/subject',
      keywords: ['subject', 'môn học', 'curriculum', 'chương trình'],
      category: 'Học tập'
    }] : []),
    ...(hasResourcePermission(permissions, 'class') ? [{
      id: 'class',
      title: 'Quản lý lớp học',
      description: 'Tạo và quản lý các lớp học',
      icon: <School className="w-5 h-5" />,
      href: '/dashboard/class',
      keywords: ['class', 'lớp học', 'classroom', 'học phần'],
      category: 'Học tập'
    }] : []),
    {
      id: 'settings',
      title: 'Cài đặt hệ thống',
      description: 'Cấu hình và tùy chỉnh hệ thống',
      icon: <Settings className="w-5 h-5" />,
      href: '/dashboard/settings',
      keywords: ['settings', 'cài đặt', 'cấu hình', 'tùy chỉnh', 'system'],
      category: 'Hệ thống'
    }
  ];

  // Filter items based on search query
  const filteredItems = menuItems.filter(item => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.keywords.some(keyword => keyword.toLowerCase().includes(query))
    );
  });

  // Group items by category
  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open command palette with Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setSearchQuery('');
        setSelectedIndex(0);
      }
      
      // Close with Escape
      if (e.key === 'Escape') {
        setIsOpen(false);
        setSearchQuery('');
        setSelectedIndex(0);
      }

      // Navigate with arrow keys when palette is open
      if (isOpen && filteredItems.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
        }
        if (e.key === 'Enter') {
          e.preventDefault();
          const selectedItem = filteredItems[selectedIndex];
          if (selectedItem) {
            router.push(selectedItem.href);
            setIsOpen(false);
            setSearchQuery('');
            setSelectedIndex(0);
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, router]);

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  const handleItemClick = (href: string) => {
    router.push(href);
    setIsOpen(false);
    setSearchQuery('');
    setSelectedIndex(0);
  };

  const handleTriggerClick = () => {
    // Only open palette if not dragging
    if (!isDragging) {
      setIsOpen(true);
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <>
      {/* Draggable Command Palette Trigger */}
      <div
        ref={triggerRef}
        className="fixed z-40 select-none"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
      >
        <div
          onMouseDown={handleMouseDown}
          onClick={handleTriggerClick}
          className={`flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-xl border border-white/20 dark:border-gray-700/30 shadow-lg hover:shadow-xl transition-all duration-300 group ${
            isDragging ? 'scale-105 shadow-2xl' : 'hover:scale-105'
          }`}
        >
          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <Bars3Icon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          </div>
          <span className="hidden sm:inline-block text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
            Nhấn ⌘K để mở menu
          </span>
          <span className="sm:hidden text-xs font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
            Menu
          </span>
          <div className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900 transition-colors">
            ⌘K
          </div>
        </div>
        
        {/* Drag indicator */}
        {isDragging && (
          <div className="absolute -top-2 -right-2 w-3 h-3 sm:w-4 sm:h-4 bg-indigo-500 rounded-full animate-pulse shadow-lg"></div>
        )}
      </div>

      {/* Command Palette Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-sm" 
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="relative w-full max-w-4xl max-h-[90vh] sm:max-h-[85vh] flex flex-col">
            <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col max-h-full">
              {/* Search Input */}
              <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                <div className="relative">
                  <MagnifyingGlassIcon className="w-5 h-5 sm:w-6 sm:h-6 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm chức năng, trang..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 text-base sm:text-lg bg-gray-50 dark:bg-gray-800 rounded-xl border-0 focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
                    autoFocus
                  />
                  <div className="hidden sm:block absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    ESC để đóng
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="flex-1 overflow-y-auto min-h-0">
                {Object.keys(groupedItems).length === 0 ? (
                  <div className="p-6 sm:p-8 text-center text-gray-500 dark:text-gray-400">
                    <MagnifyingGlassIcon className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm sm:text-base">Không tìm thấy kết quả cho &quot;{searchQuery}&quot;</p>
                    <p className="text-xs sm:text-sm mt-1">Thử tìm kiếm với từ khóa khác</p>
                  </div>
                ) : (
                  Object.entries(groupedItems).map(([category, items]) => (
                    <div key={category} className="px-4 sm:px-6 py-3 sm:py-4">
                      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 sm:mb-3">
                        {category}
                      </h3>
                      <div className="space-y-1">
                        {items.map((item) => {
                          const globalIndex = filteredItems.indexOf(item);
                          const isSelected = globalIndex === selectedIndex;
                          return (
                            <button
                              key={item.id}
                              onClick={() => handleItemClick(item.href)}
                              className={`w-full flex items-center space-x-3 sm:space-x-4 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-200 cursor-pointer text-left ${
                                isSelected
                                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                                  : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                              }`}
                            >
                              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                isSelected 
                                  ? 'bg-white/20' 
                                  : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                              }`}>
                                <div className="text-white scale-75 sm:scale-100">
                                  {item.icon}
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className={`font-medium text-sm sm:text-base ${isSelected ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                                  {item.title}
                                </h3>
                                <p className={`text-xs sm:text-sm hidden sm:block ${isSelected ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                                  {item.description}
                                </p>
                              </div>
                              <div className={`hidden sm:block text-xs px-2 py-1 rounded ${
                                isSelected 
                                  ? 'bg-white/20 text-white' 
                                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                              }`}>
                                ↵
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex-shrink-0">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div className="hidden sm:flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <kbd className="bg-white dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs">↑↓</kbd>
                      <span>điều hướng</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <kbd className="bg-white dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs">↵</kbd>
                      <span>chọn</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <kbd className="bg-white dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs">esc</kbd>
                      <span>đóng</span>
                    </span>
                  </div>
                  <div className="sm:hidden flex items-center space-x-2 text-xs">
                    <span>Nhấn để chọn</span>
                  </div>
                  <span className="text-xs">{filteredItems.length} kết quả</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};