'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ColorTheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  cssVars: {
    '--color-primary': string;
    '--color-secondary': string;
    '--color-accent': string;
    '--color-primary-50': string;
    '--color-primary-100': string;
    '--color-primary-500': string;
    '--color-primary-600': string;
    '--color-primary-900': string;
  };
}

interface ColorThemeContextType {
  currentTheme: ColorTheme;
  setTheme: (themeId: string) => void;
  availableThemes: ColorTheme[];
}

const defaultThemes: ColorTheme[] = [
  {
    id: 'current',
    name: 'Màu hiện tại (Mặc định)',
    primary: 'indigo-600',
    secondary: 'purple-600',
    accent: 'pink-500',
    cssVars: {
      '--color-primary': '#4f46e5',
      '--color-secondary': '#9333ea',
      '--color-accent': '#ec4899',
      '--color-primary-50': '#eef2ff',
      '--color-primary-100': '#e0e7ff',
      '--color-primary-500': '#6366f1',
      '--color-primary-600': '#4f46e5',
      '--color-primary-900': '#312e81'
    }
  },
  {
    id: 'emerald',
    name: 'Emerald Green',
    primary: 'emerald-600',
    secondary: 'teal-600',
    accent: 'green-500',
    cssVars: {
      '--color-primary': '#059669',
      '--color-secondary': '#0d9488',
      '--color-accent': '#22c55e',
      '--color-primary-50': '#ecfdf5',
      '--color-primary-100': '#d1fae5',
      '--color-primary-500': '#10b981',
      '--color-primary-600': '#059669',
      '--color-primary-900': '#064e3b'
    }
  },
  {
    id: 'orange',
    name: 'Orange Sunset',
    primary: 'orange-600',
    secondary: 'red-600',
    accent: 'yellow-500',
    cssVars: {
      '--color-primary': '#ea580c',
      '--color-secondary': '#dc2626',
      '--color-accent': '#eab308',
      '--color-primary-50': '#fff7ed',
      '--color-primary-100': '#ffedd5',
      '--color-primary-500': '#f97316',
      '--color-primary-600': '#ea580c',
      '--color-primary-900': '#9a3412'
    }
  },
  {
    id: 'blue',
    name: 'Ocean Blue',
    primary: 'blue-600',
    secondary: 'cyan-600',
    accent: 'sky-500',
    cssVars: {
      '--color-primary': '#2563eb',
      '--color-secondary': '#0891b2',
      '--color-accent': '#0ea5e9',
      '--color-primary-50': '#eff6ff',
      '--color-primary-100': '#dbeafe',
      '--color-primary-500': '#3b82f6',
      '--color-primary-600': '#2563eb',
      '--color-primary-900': '#1e3a8a'
    }
  },
  {
    id: 'rose',
    name: 'Rose Pink',
    primary: 'rose-600',
    secondary: 'pink-600',
    accent: 'fuchsia-500',
    cssVars: {
      '--color-primary': '#e11d48',
      '--color-secondary': '#db2777',
      '--color-accent': '#d946ef',
      '--color-primary-50': '#fff1f2',
      '--color-primary-100': '#ffe4e6',
      '--color-primary-500': '#f43f5e',
      '--color-primary-600': '#e11d48',
      '--color-primary-900': '#881337'
    }
  }
];

const ColorThemeContext = createContext<ColorThemeContextType | undefined>(undefined);

export const useColorTheme = () => {
  const context = useContext(ColorThemeContext);
  if (!context) {
    throw new Error('useColorTheme must be used within a ColorThemeProvider');
  }
  return context;
};

interface ColorThemeProviderProps {
  children: ReactNode;
}

export const ColorThemeProvider: React.FC<ColorThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ColorTheme>(defaultThemes[0]);

  useEffect(() => {
    // Load saved theme from localStorage
    const savedThemeId = localStorage.getItem('colorTheme');
    if (savedThemeId) {
      const theme = defaultThemes.find(t => t.id === savedThemeId);
      if (theme) {
        setCurrentTheme(theme);
        applyTheme(theme);
      }
    }
  }, []);

  const applyTheme = (theme: ColorTheme) => {
    // Apply CSS variables to document root
    const root = document.documentElement;
    Object.entries(theme.cssVars).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    // Add theme class to body for additional styling
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${theme.id}`);
  };

  const setTheme = (themeId: string) => {
    const theme = defaultThemes.find(t => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
      applyTheme(theme);
      localStorage.setItem('colorTheme', themeId);
    }
  };

  return (
    <ColorThemeContext.Provider 
      value={{ 
        currentTheme, 
        setTheme, 
        availableThemes: defaultThemes 
      }}
    >
      {children}
    </ColorThemeContext.Provider>
  );
}; 