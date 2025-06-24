'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';
import ProfileAvatar from '@/components/ui/ProfileAvatar';
import { useAuthStore } from '@/features/auth/store';
import { 
  Search, 
  Sun, 
  Moon, 
  Menu,
  Clock,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { StudentSidebar } from './StudentSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getStudentByEmail } from '@/features/student/services/studentService';
import { getClassById } from '@/features/classes/services/classServices';
import NotificationBell from '@/features/notifications/components/NotificationBell';
import { useRouter } from 'next/navigation';

export const StudentNavbar = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const user = useAuthStore((state) => state.user);
  const [classCode, setClassCode] = useState<string>('');
  const email = user?.email;
  const router = useRouter();

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        if (!email) return;
        const res = await getStudentByEmail(email);
        // Fetch class info sau khi có student data
        if (res.classId) {
          const classRes = await getClassById(res.classId);
          setClassCode(classRes.code);
        }
        
        console.log('Student data:', res);
      } catch (err) {
        console.error('Error fetching student:', err);
      }
    };

    fetchStudent();
  }, [email]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/exams/practice?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="h-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg shadow-blue-500/5 dark:shadow-indigo-500/10 sticky top-0 z-50">
      <div className="h-full px-4 lg:px-6">
        <div className="flex items-center justify-between h-full">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden p-2">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-80">
                <StudentSidebar isMobile />
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link href="/home" className="flex items-center gap-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl">
                  <Image src="/logo.png" alt="Logo" width={40} height={40} className="relative z-10" />
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
                  MegaStar
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  Online Exam System
                </p>
              </div>
            </Link>

            {/* Time & Date Display */}
            <div className="hidden md:flex items-center gap-3 ml-6 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <div className="text-sm">
                <div className="font-semibold text-gray-900 dark:text-white">
                  {formatTime(currentTime)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(currentTime)}
                </div>
              </div>
            </div>
          </div>

          {/* Center Section - Search */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Tìm kiếm bài thi, môn học..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="pl-10 pr-4 py-2 w-full bg-gray-50/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Search Mobile */}
            <Button variant="ghost" size="sm" className="lg:hidden p-2">
              <Search className="w-6 h-6" />
            </Button>

            {/* Notifications */}
            <div className="flex items-center justify-center w-10 h-10">
              <NotificationBell />
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="w-10 h-10 p-0 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors duration-200"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-600" />
              )}
            </Button>

            {/* User Profile */}
            <div className="flex items-center gap-3 pl-3 border-l border-gray-200 dark:border-gray-700">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.accountname || 'Sinh viên'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Lớp: {classCode}
                </p>
              </div>
              <ProfileAvatar />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}; 