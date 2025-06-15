'use client';

import { useNavigationLoading } from '@/hooks/useNavigationLoading';
import { PageLoader } from '@/components/ui/PageLoader';

export const NavigationLoader = () => {
  const { isLoading } = useNavigationLoading();

  return (
    <PageLoader 
      isLoading={isLoading} 
      loadingText="Đang tải trang..." 
    />
  );
}; 