'use client';

import { usePreloadRoutes } from '@/hooks/usePreloadRoutes';

export const PreloadPages = () => {
  // Preload các trang dashboard quan trọng
  const dashboardRoutes = [
    '/dashboard/account',
    '/dashboard/student', 
    '/dashboard/question',
    '/dashboard/subject',
    '/dashboard/class',
    '/dashboard/role',
    '/dashboard/schedule',
    '/dashboard/exam'
  ];

  usePreloadRoutes({
    routes: dashboardRoutes,
    delay: 1000, // Đợi 1 giây sau khi load trang chính
    enabled: true
  });

  return null; // Component này không render gì cả
}; 