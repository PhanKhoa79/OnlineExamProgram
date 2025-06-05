/**
 * Formats a date string to Vietnamese locale format
 * @param dateString - ISO date string
 * @returns Formatted date string in Vietnamese format (DD/MM/YYYY HH:mm:ss)
 */
export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
};

/**
 * Formats a date string to Vietnamese date format only
 * @param dateString - ISO date string  
 * @returns Formatted date string in Vietnamese format (DD/MM/YYYY)
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

/**
 * Formats a date string to Vietnamese time format only
 * @param dateString - ISO date string
 * @returns Formatted time string in Vietnamese format (HH:mm:ss)
 */
export const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}; 