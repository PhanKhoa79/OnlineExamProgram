'use client';

import { ReactNode } from 'react';
import { useDashboardTemplate } from '@/components/providers/DashboardTemplateProvider';

interface TemplateWrapperProps {
  children: ReactNode;
}

export const TemplateWrapper: React.FC<TemplateWrapperProps> = ({ children }) => {
  const { currentTemplate } = useDashboardTemplate();

  return (
    <div className={`template-${currentTemplate.id} min-h-screen transition-all duration-500`}>
      {children}
    </div>
  );
}; 