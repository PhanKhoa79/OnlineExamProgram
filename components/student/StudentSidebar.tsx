'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  Home,
  BookOpen,
  FileText,
  BarChart3,
  Settings,
  HelpCircle,
  Calendar,
  User,
  ChevronRight,
  GraduationCap,
  Target,
  History,
  Award,
  MessageCircle,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StudentSidebarProps {
  isMobile?: boolean;
}

interface MenuItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  description?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    title: 'Trang chủ',
    href: '/home',
    icon: <Home className="w-5 h-5" />,
    description: 'Tổng quan và thông báo'
  },
  {
    title: 'Bài thi',
    href: '/exams',
    icon: <FileText className="w-5 h-5" />,
    description: 'Danh sách bài thi khả dụng',
    children: [
      {
        title: 'Bài thi chính thức',
        href: '/exams/official',
        icon: <GraduationCap className="w-4 h-4" />
      },
      {
        title: 'Bài thi thử',
        href: '/exams/practice',
        icon: <Target className="w-4 h-4" />
      }
    ]
  },
  {
    title: 'Kết quả',
    href: '/results/history',
    icon: <Award className="w-5 h-5" />,
    description: 'Xem điểm và phân tích',
    children: [
      {
        title: 'Lịch sử thi',
        href: '/results/history',
        icon: <History className="w-4 h-4" />
      },
      {
        title: 'Thống kê',
        href: '/results/statistics',
        icon: <BarChart3 className="w-4 h-4" />
      }
    ]
  },
  {
    title: 'Lịch thi',
    href: '/schedules',
    icon: <Calendar className="w-5 h-5" />,
    description: 'Lịch thi sắp tới'
  },
  {
    title: 'Hồ sơ',
    href: '/profile',
    icon: <User className="w-5 h-5" />,
    description: 'Thông tin cá nhân'
  },
  {
    title: 'Hỗ trợ',
    href: '/support',
    icon: <HelpCircle className="w-5 h-5" />,
    description: 'Trợ giúp và FAQ',
    children: [
      {
        title: 'Hướng dẫn',
        href: '/support/guide',
        icon: <BookOpen className="w-4 h-4" />
      },
      {
        title: 'Liên hệ',
        href: '/support/contact',
        icon: <MessageCircle className="w-4 h-4" />
      }
    ]
  },
  {
    title: 'Bảo mật',
    href: '/security',
    icon: <Settings className="w-5 h-5" />,
    description: 'Đổi mật khẩu và bảo mật'
  }
];

export const StudentSidebar = ({ isMobile = false }: StudentSidebarProps) => {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleExpanded = (href: string) => {
    setExpandedItems(prev => 
      prev.includes(href) 
        ? prev.filter(item => item !== href)
        : [...prev, href]
    );
  };

  const toggleCollapsed = () => {
    setIsCollapsed(prev => !prev);
    // Close all expanded items when collapsing
    if (!isCollapsed) {
      setExpandedItems([]);
    }
  };

  const isActive = (href: string) => {
    if (href === '/home') {
      return pathname === '/home' || pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const isExpanded = (href: string) => expandedItems.includes(href);

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const active = isActive(item.href);
    const expanded = isExpanded(item.href);

    return (
      <div key={item.href} className="space-y-1">
        <div className="relative group">
          {hasChildren ? (
            <div className="relative">
              <Link href={item.href} className="block">
              <div className={cn(
                "flex items-center w-full px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer",
                isCollapsed ? "justify-center" : "justify-between",
                active 
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25" 
                  : "hover:bg-white/60 dark:hover:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white",
                level > 0 && "py-2"
              )}>
                <div className={cn(
                  "flex items-center",
                  isCollapsed ? "justify-center" : "gap-3"
                )}>
                  <div className={cn(
                    "flex items-center justify-center rounded-lg transition-all duration-200 cursor-pointer",
                    level > 0 ? "w-6 h-6" : "w-8 h-8",
                    active 
                      ? "bg-white/30 text-white" 
                      : "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50"
                  )}>
                    {item.icon}
                  </div>
                  {!isCollapsed && (
                    <div className="flex-1 text-left">
                      <div className={cn(
                        "font-medium text-sm cursor-pointer",
                        level > 0 && "text-xs",
                        active && "text-white font-semibold"
                      )}>
                        {item.title}
                      </div>
                      {item.description && level === 0 && !isMobile && (
                        <div className={cn(
                          "text-xs mt-0.5 cursor-pointer",
                          active 
                            ? "text-white/80" 
                            : "text-gray-500 dark:text-gray-400"
                        )}>
                          {item.description}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                </div>
              </Link>
              {/* Dropdown toggle button positioned absolute */}
                {!isCollapsed && (
                <Button
                  variant="ghost"
                  onClick={() => toggleExpanded(item.href)}
                  className="absolute top-0 right-0 h-full p-0 px-3 hover:bg-transparent"
                >
                  <ChevronRight className={cn(
                    "w-4 h-4 transition-transform duration-200 cursor-pointer",
                    expanded && "rotate-90"
                  )} />
                </Button>
              )}
              {/* For collapsed mode, add a click handler to expand menu */}
              {isCollapsed && hasChildren && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsCollapsed(false);
                    setTimeout(() => toggleExpanded(item.href), 100);
                  }}
                  className="absolute top-0 right-0 w-full h-full p-0 opacity-0"
                  title={`Mở rộng menu ${item.title}`}
                />
                )}
              </div>
          ) : (
            <Link href={item.href}>
              <div className={cn(
                "flex items-center w-full px-3 py-2.5 rounded-xl transition-all duration-200 group cursor-pointer",
                isCollapsed ? "justify-center" : "justify-between",
                active 
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25" 
                  : "hover:bg-white/60 dark:hover:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white",
                level > 0 && "py-2"
              )}
              title={isCollapsed ? item.title : undefined}
              >
                <div className={cn(
                  "flex items-center",
                  isCollapsed ? "justify-center" : "gap-3"
                )}>
                  <div className={cn(
                    "flex items-center justify-center rounded-lg transition-all duration-200 cursor-pointer",
                    level > 0 ? "w-6 h-6" : "w-8 h-8",
                    active 
                      ? "bg-white/30 text-white" 
                      : "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50"
                  )}>
                    {item.icon}
                  </div>
                  {!isCollapsed && (
                    <div className="flex-1 text-left">
                      <div className={cn(
                        "font-medium text-sm cursor-pointer",
                        level > 0 && "text-xs",
                        active && "text-white font-semibold"
                      )}>
                        {item.title}
                      </div>
                      {item.description && level === 0 && !isMobile && (
                        <div className={cn(
                          "text-xs mt-0.5 cursor-pointer",
                          active 
                            ? "text-white/80" 
                            : "text-gray-500 dark:text-gray-400"
                        )}>
                          {item.description}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* Children */}
        {hasChildren && expanded && !isCollapsed && (
          <div className="space-y-1 ml-4">
            {item.children?.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className={cn(
      "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 shadow-lg shadow-blue-500/5 dark:shadow-indigo-500/10 transition-all duration-300",
      isMobile ? "w-full h-full" : "h-full hidden lg:block",
      isCollapsed ? "w-20" : "w-80"
    )}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className={cn(
            "flex items-center",
            isCollapsed ? "justify-center" : "gap-3"
          )}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  Student Portal
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Hệ thống thi trắc nghiệm
                </p>
              </div>
            )}
          </div>
          
          {/* Toggle Button */}
          {!isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCollapsed}
              className={cn(
                "mt-4 w-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200",
                isCollapsed && "px-2"
              )}
              title={isCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="w-4 h-4" />
              ) : (
                <>
                  <PanelLeftClose className="w-4 h-4 mr-2" />
                  <span className="text-sm">Thu gọn</span>
                </>
              )}
            </Button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {menuItems.map(item => renderMenuItem(item))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className={cn(
            "flex items-center",
            isCollapsed ? "justify-center" : "gap-2"
          )}>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  ExamSystem
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  v1.0.0
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}; 