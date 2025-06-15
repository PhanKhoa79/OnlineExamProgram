'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface UsePreloadRoutesOptions {
  routes: string[];
  delay?: number;
  enabled?: boolean;
}

export const usePreloadRoutes = ({ 
  routes, 
  delay = 1000, 
  enabled = true 
}: UsePreloadRoutesOptions) => {
  const router = useRouter();

  useEffect(() => {
    if (!enabled || !routes.length) return;

    const preloadTimer = setTimeout(() => {
      routes.forEach(route => {
        try {
          router.prefetch(route);
        } catch (error) {
          console.warn(`Failed to prefetch route: ${route}`, error);
        }
      });
    }, delay);

    return () => clearTimeout(preloadTimer);
  }, [router, routes, delay, enabled]);
}; 