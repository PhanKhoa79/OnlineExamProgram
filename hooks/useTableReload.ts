'use client';

import { useState, useCallback } from 'react';

interface UseTableReloadOptions {
  onReload: () => Promise<void>;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useTableReload = ({ 
  onReload, 
  onSuccess, 
  onError 
}: UseTableReloadOptions) => {
  const [isReloading, setIsReloading] = useState(false);

  const handleReload = useCallback(async () => {
    try {
      setIsReloading(true);
      await onReload();
      onSuccess?.();
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error occurred');
      onError?.(err);
      console.error('Error reloading data:', err);
    } finally {
      setIsReloading(false);
    }
  }, [onReload, onSuccess, onError]);

  return {
    isReloading,
    handleReload
  };
}; 