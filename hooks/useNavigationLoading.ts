'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

export const useNavigationLoading = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingRoute, setLoadingRoute] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const navigateWithLoading = (href: string) => {
    if (href === pathname) return; // Không navigate nếu đã ở trang đó
    
    setIsLoading(true);
    setLoadingRoute(href);
    
    // Sử dụng push với callback
    router.push(href);
    
    // Set timeout để reset loading state nếu navigation quá lâu
    const timeout = setTimeout(() => {
      setIsLoading(false);
      setLoadingRoute(null);
    }, 10000); // 10 giây timeout

    return () => clearTimeout(timeout);
  };

  // Reset loading state khi pathname thay đổi
  useEffect(() => {
    setIsLoading(false);
    setLoadingRoute(null);
  }, [pathname]);

  return {
    isLoading,
    loadingRoute,
    navigateWithLoading
  };
}; 