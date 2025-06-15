'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
  className?: string;
}

export const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary',
  className = '' 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  };

  const colorClasses = {
    primary: 'border-indigo-500',
    secondary: 'border-gray-500',
    white: 'border-white'
  };

  return (
    <div 
      className={`
        inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent
        ${sizeClasses[size]} 
        ${colorClasses[color]} 
        ${className}
      `}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}; 