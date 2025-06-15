// src/components/AuthInput.tsx
import React from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

interface AuthInputProps {
  id: string;
  title?: string;
  label: string;
  type: string;
  value: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  error?: string | null;
  Icon: React.ElementType;
  showPasswordToggle?: () => void;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
}

const AuthInput: React.FC<AuthInputProps> = ({
  id,
  title,
  label,
  type,
  value,
  onChange,
  error,
  Icon,
  showPasswordToggle,
  disabled = false,
  placeholder,
  maxLength,
}) => (
  <div className="relative w-full">
    <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-2 dark:text-white">
      {title || label}
    </label>
    <div className="relative group">
      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200">
        <Icon fontSize="small" />
      </span>
      <input
        id={id}
        type={type}
        placeholder={placeholder || label}
        value={value}
        onChange={onChange}
        disabled={disabled}
        maxLength={maxLength}
        className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl bg-white dark:bg-gray-700 dark:text-white focus:outline-none transition-all duration-200 ${
          error 
            ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/20" 
            : "border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 hover:border-gray-300"
        } ${disabled ? "bg-gray-100 dark:bg-gray-600 cursor-not-allowed opacity-60" : ""}`}
      />
      {showPasswordToggle && (
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors duration-200">
          {type === "password" ? (
            <VisibilityOffIcon onClick={showPasswordToggle} />
          ) : (
            <VisibilityIcon onClick={showPasswordToggle} />
          )}
        </div>
      )}
    </div>
    {error && (
      <div className="flex items-center mt-2">
        <svg className="w-4 h-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <p className="text-red-500 text-sm font-medium">{error}</p>
      </div>
    )}
  </div>
);

export default AuthInput;
