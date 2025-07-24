'use client';

import { useState, useEffect, useCallback } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface RelativeTimeProps {
  date: string | Date;
  className?: string;
  updateInterval?: number; // milliseconds
}

export const RelativeTime = ({
  date,
  className = '',
  updateInterval = 60000, // 1 phút
}: RelativeTimeProps) => {
  const [relativeTime, setRelativeTime] = useState('');

  const updateTime = useCallback(() => {
    try {
      const formattedTime = formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: vi,
      });
      setRelativeTime(formattedTime);
    } catch (error) {
      console.error('Error formatting time:', error);
      setRelativeTime('Thời gian không hợp lệ');
    }
  }, [date]);

  useEffect(() => {
    // Cập nhật lần đầu
    updateTime();

    // Thiết lập interval để tự động cập nhật
    const interval = setInterval(updateTime, updateInterval);

    // Cleanup interval khi component unmount
    return () => clearInterval(interval);
  }, [updateTime, updateInterval]);

  return <span className={className}>{relativeTime}</span>;
};