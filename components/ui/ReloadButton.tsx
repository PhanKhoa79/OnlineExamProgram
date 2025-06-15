'use client';

import { RefreshCw } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface ReloadButtonProps {
  onReload: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  className?: string;
  showText?: boolean;
}

export const ReloadButton = ({
  onReload,
  isLoading = false,
  disabled = false,
  size = 'sm',
  variant = 'outline',
  className = '',
  showText = true
}: ReloadButtonProps) => {
  return (
    <Button
      onClick={onReload}
      disabled={disabled || isLoading}
      size={size}
      variant={variant}
      className={cn(
        'flex items-center gap-2 cursor-pointer transition-all duration-200',
        className
      )}
    >
      <RefreshCw 
        className={cn(
          'h-4 w-4 transition-transform duration-500',
          isLoading && 'animate-spin'
        )} 
      />
      {showText && (
        <span className="hidden sm:inline">
          {isLoading ? 'Đang tải...' : 'Làm mới'}
        </span>
      )}
    </Button>
  );
}; 