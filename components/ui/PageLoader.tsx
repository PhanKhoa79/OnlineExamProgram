'use client';

import { LoadingSpinner } from './LoadingSpinner';

interface PageLoaderProps {
  isLoading: boolean;
  loadingText?: string;
}

export const PageLoader = ({ 
  isLoading, 
  loadingText = "Đang tải..." 
}: PageLoaderProps) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[999999] flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-2xl shadow-indigo-500/20 border border-white/20 dark:border-gray-700/30 backdrop-blur-xl">
        <div className="flex flex-col items-center space-y-4">
          <LoadingSpinner size="lg" color="primary" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 animate-pulse">
            {loadingText}
          </p>
        </div>
      </div>
    </div>
  );
}; 