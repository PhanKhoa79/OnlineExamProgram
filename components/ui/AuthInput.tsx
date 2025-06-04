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
    <label htmlFor={id} className="block text-sm font-bold text-black-700 mb-1 dark:text-white">
      {title}
    </label>
    <div className="relative">
      <span className="absolute left-3 top-5 transform -translate-y-1/2 text-gray-400">
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
        className={`w-full pl-10 pr-4 py-2 border rounded-md bg-white dark:bg-gray-700 dark:text-white focus:outline-none ${
          error ? "border-red-500" : "border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-sky-400"
        } ${disabled ? "bg-gray-200 dark:bg-gray-600 cursor-not-allowed" : ""}`}
      />
      {showPasswordToggle && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer">
          {type === "password" ? (
            <VisibilityOffIcon onClick={showPasswordToggle} />
          ) : (
            <VisibilityIcon onClick={showPasswordToggle} />
          )}
        </div>
      )}
    </div>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default AuthInput;
