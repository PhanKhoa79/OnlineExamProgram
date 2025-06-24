'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface DashboardTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  features: string[];
  layoutConfig: {
    cardLayout: 'grid' | 'masonry' | 'flex' | 'list';
    cardSize: 'small' | 'medium' | 'large';
    spacing: 'compact' | 'normal' | 'spacious';
    headerStyle: 'minimal' | 'standard' | 'detailed';
    sidebarPosition: 'left' | 'right' | 'none';
    colorScheme: 'light' | 'dark' | 'auto';
    animations: boolean;
    glassmorphism: boolean;
  };
}

interface DashboardTemplateContextType {
  currentTemplate: DashboardTemplate;
  setTemplate: (templateId: string) => void;
  availableTemplates: DashboardTemplate[];
  resetToDefault: () => void;
}

const defaultTemplates: DashboardTemplate[] = [
  {
    id: 'default',
    name: 'Mặc định',
    description: 'Giao diện dashboard chuẩn với layout cân bằng',
    preview: 'bg-gradient-to-br from-gray-100 to-gray-200',
    features: ['Layout cân bằng', 'Dễ sử dụng', 'Tối ưu hiệu suất'],
    layoutConfig: {
      cardLayout: 'grid',
      cardSize: 'medium',
      spacing: 'normal',
      headerStyle: 'standard',
      sidebarPosition: 'left',
      colorScheme: 'auto',
      animations: true,
      glassmorphism: true
    }
  },
  {
    id: 'modern',
    name: 'Modern Glassmorphism',
    description: 'Thiết kế hiện đại với hiệu ứng kính mờ và gradient đẹp mắt',
    preview: 'bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500',
    features: ['Glassmorphism', 'Gradient đẹp', 'Hiệu ứng hover', 'Responsive'],
    layoutConfig: {
      cardLayout: 'masonry',
      cardSize: 'large',
      spacing: 'spacious',
      headerStyle: 'detailed',
      sidebarPosition: 'left',
      colorScheme: 'auto',
      animations: true,
      glassmorphism: true
    }
  },
  {
    id: 'minimal',
    name: 'Minimal Clean',
    description: 'Giao diện tối giản, tập trung vào nội dung chính',
    preview: 'bg-gradient-to-br from-gray-50 to-white',
    features: ['Tối giản', 'Tập trung nội dung', 'Tải nhanh', 'Dễ đọc'],
    layoutConfig: {
      cardLayout: 'list',
      cardSize: 'small',
      spacing: 'compact',
      headerStyle: 'minimal',
      sidebarPosition: 'none',
      colorScheme: 'light',
      animations: false,
      glassmorphism: false
    }
  },
  {
    id: 'corporate',
    name: 'Corporate Professional',
    description: 'Phong cách doanh nghiệp chuyên nghiệp với màu sắc trang trọng',
    preview: 'bg-gradient-to-br from-slate-600 to-slate-800',
    features: ['Chuyên nghiệp', 'Màu trang trọng', 'Layout rõ ràng', 'Phù hợp doanh nghiệp'],
    layoutConfig: {
      cardLayout: 'grid',
      cardSize: 'medium',
      spacing: 'normal',
      headerStyle: 'detailed',
      sidebarPosition: 'left',
      colorScheme: 'dark',
      animations: true,
      glassmorphism: false
    }
  },
  {
    id: 'creative',
    name: 'Creative Colorful',
    description: 'Thiết kế sáng tạo với màu sắc rực rỡ và layout độc đáo',
    preview: 'bg-gradient-to-br from-yellow-400 via-red-500 to-pink-500',
    features: ['Màu sắc rực rỡ', 'Layout độc đáo', 'Sáng tạo', 'Nổi bật'],
    layoutConfig: {
      cardLayout: 'masonry',
      cardSize: 'large',
      spacing: 'spacious',
      headerStyle: 'detailed',
      sidebarPosition: 'right',
      colorScheme: 'light',
      animations: true,
      glassmorphism: true
    }
  }
];

const DashboardTemplateContext = createContext<DashboardTemplateContextType | undefined>(undefined);

export const useDashboardTemplate = () => {
  const context = useContext(DashboardTemplateContext);
  if (!context) {
    throw new Error('useDashboardTemplate must be used within a DashboardTemplateProvider');
  }
  return context;
};

interface DashboardTemplateProviderProps {
  children: ReactNode;
}

export const DashboardTemplateProvider: React.FC<DashboardTemplateProviderProps> = ({ children }) => {
  const [currentTemplate, setCurrentTemplate] = useState<DashboardTemplate>(defaultTemplates[0]);

  useEffect(() => {
    // Load saved template from localStorage
    const savedTemplateId = localStorage.getItem('dashboardTemplate');
    if (savedTemplateId) {
      const template = defaultTemplates.find(t => t.id === savedTemplateId);
      if (template) {
        setCurrentTemplate(template);
        applyTemplate(template);
      }
    }
  }, []);

  const applyTemplate = (template: DashboardTemplate) => {
    // Apply template configuration to document
    const root = document.documentElement;
    
    // Set CSS custom properties for template configuration
    root.style.setProperty('--template-card-layout', template.layoutConfig.cardLayout);
    root.style.setProperty('--template-card-size', template.layoutConfig.cardSize);
    root.style.setProperty('--template-spacing', template.layoutConfig.spacing);
    root.style.setProperty('--template-header-style', template.layoutConfig.headerStyle);
    root.style.setProperty('--template-sidebar-position', template.layoutConfig.sidebarPosition);
    root.style.setProperty('--template-animations', template.layoutConfig.animations ? 'enabled' : 'disabled');
    root.style.setProperty('--template-glassmorphism', template.layoutConfig.glassmorphism ? 'enabled' : 'disabled');

    // Add template class to body for additional styling
    document.body.className = document.body.className.replace(/template-\w+/g, '');
    document.body.classList.add(`template-${template.id}`);

    // Apply spacing classes
    const spacingMap = {
      compact: 'gap-2 p-2',
      normal: 'gap-4 p-4',
      spacious: 'gap-6 p-6'
    };
    root.style.setProperty('--template-spacing-classes', spacingMap[template.layoutConfig.spacing]);

    // Apply card size classes
    const cardSizeMap = {
      small: 'min-h-[120px]',
      medium: 'min-h-[200px]',
      large: 'min-h-[300px]'
    };
    root.style.setProperty('--template-card-size-classes', cardSizeMap[template.layoutConfig.cardSize]);
  };

  const setTemplate = (templateId: string) => {
    const template = defaultTemplates.find(t => t.id === templateId);
    if (template) {
      setCurrentTemplate(template);
      applyTemplate(template);
      localStorage.setItem('dashboardTemplate', templateId);
    }
  };

  const resetToDefault = () => {
    setTemplate('default');
  };

  return (
    <DashboardTemplateContext.Provider 
      value={{ 
        currentTemplate, 
        setTemplate, 
        availableTemplates: defaultTemplates,
        resetToDefault
      }}
    >
      {children}
    </DashboardTemplateContext.Provider>
  );
}; 