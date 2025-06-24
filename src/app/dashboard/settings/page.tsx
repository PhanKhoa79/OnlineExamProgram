'use client';

import { useState, useEffect } from 'react';
import { 
  CloudArrowUpIcon, 
  PaintBrushIcon, 
  SwatchIcon,
  CheckIcon,
  ClockIcon,
  ServerIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { useColorTheme } from '@/components/providers/ColorThemeProvider';
import { useDashboardTemplate } from '@/components/providers/DashboardTemplateProvider';

interface BackupSchedule {
  id: string;
  label: string;
  description: string;
  frequency: string;
}





export default function SettingsPage() {
  const [selectedBackup, setSelectedBackup] = useState<string | null>('daily');
  const [isClient, setIsClient] = useState(false);
  const { currentTheme, setTheme, availableThemes } = useColorTheme();
  const { currentTemplate, setTemplate, availableTemplates } = useDashboardTemplate();

  useEffect(() => {
    setIsClient(true);
    // Load saved settings from localStorage
    const savedBackup = localStorage.getItem('backupSchedule');
    
    if (savedBackup) setSelectedBackup(savedBackup);
  }, []);

  const backupSchedules: BackupSchedule[] = [
    {
      id: 'realtime',
      label: 'Thời gian thực',
      description: 'Sao lưu ngay lập tức khi có thay đổi dữ liệu',
      frequency: 'Liên tục'
    },
    {
      id: 'hourly',
      label: 'Hàng giờ',
      description: 'Sao lưu dữ liệu mỗi giờ một lần',
      frequency: '24 lần/ngày'
    },
    {
      id: 'daily',
      label: 'Hàng ngày',
      description: 'Sao lưu dữ liệu vào lúc 2:00 AM mỗi ngày',
      frequency: '1 lần/ngày'
    },
    {
      id: 'weekly',
      label: 'Hàng tuần',
      description: 'Sao lưu dữ liệu vào Chủ nhật hàng tuần',
      frequency: '1 lần/tuần'
    },
    {
      id: 'monthly',
      label: 'Hàng tháng',
      description: 'Sao lưu dữ liệu vào ngày đầu tiên của tháng',
      frequency: '1 lần/tháng'
    }
  ];





  const handleBackupChange = (scheduleId: string) => {
    const newValue = selectedBackup === scheduleId ? null : scheduleId;
    setSelectedBackup(newValue);
    if (newValue) {
      localStorage.setItem('backupSchedule', newValue);
    } else {
      localStorage.removeItem('backupSchedule');
    }
  };

  const handleTemplateChange = (templateId: string) => {
    // If clicking the same template, reset to default template
    if (currentTemplate.id === templateId) {
      if (templateId !== 'default') {
        setTemplate('default'); // Reset to default template
      }
      // If already on 'default' template, do nothing (can't deselect default)
    } else {
      setTemplate(templateId);
    }
  };

  const handleThemeChange = (themeId: string) => {
    // If clicking the same theme, reset to default theme (but only if it's not already 'current')
    if (currentTheme.id === themeId) {
      if (themeId !== 'current') {
        setTheme('current'); // Reset to default theme
      }
      // If already on 'current' theme, do nothing (can't deselect default)
    } else {
      setTheme(themeId);
    }
  };

  if (!isClient) {
    return (
      <div className="p-6 space-y-8">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="space-y-4">
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
          <SwatchIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
            Cài đặt hệ thống
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Tùy chỉnh và cấu hình hệ thống theo nhu cầu của bạn
          </p>
        </div>
      </div>

      {/* Backup Settings */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/30 dark:border-gray-700/30 shadow-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <CloudArrowUpIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Sao lưu dữ liệu định kỳ
          </h2>
        </div>
        
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            💡 <strong>Lưu ý:</strong> Click vào option đã chọn để bỏ chọn. Không chọn option nào có nghĩa là tắt tính năng đó.
          </p>
        </div>
        
        {!selectedBackup && (
          <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
            <div className="text-center">
              <CloudArrowUpIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 dark:text-gray-400 font-medium">Sao lưu tự động đã tắt</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">Chọn một tùy chọn bên dưới để bật sao lưu định kỳ</p>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {backupSchedules.map((schedule) => (
            <div
              key={schedule.id}
              onClick={() => handleBackupChange(schedule.id)}
              className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                selectedBackup === schedule.id
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30'
                  : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600'
              }`}
            >
              {selectedBackup === schedule.id && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                  <CheckIcon className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div className="flex items-center space-x-3 mb-3">
                <ClockIcon className={`w-5 h-5 ${selectedBackup === schedule.id ? 'text-indigo-600' : 'text-gray-500'}`} />
                <h3 className={`font-medium ${selectedBackup === schedule.id ? 'text-indigo-900 dark:text-indigo-100' : 'text-gray-900 dark:text-white'}`}>
                  {schedule.label}
                </h3>
              </div>
              
              <p className={`text-sm mb-2 ${selectedBackup === schedule.id ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-600 dark:text-gray-400'}`}>
                {schedule.description}
              </p>
              
              <div className={`text-xs font-medium ${selectedBackup === schedule.id ? 'text-indigo-600' : 'text-gray-500'}`}>
                Tần suất: {schedule.frequency}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Template Settings */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/30 dark:border-gray-700/30 shadow-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <PaintBrushIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Chọn template giao diện dashboard
          </h2>
        </div>
        
        <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
          <p className="text-sm text-purple-700 dark:text-purple-300">
            💡 <strong>Lưu ý:</strong> Click vào template đã chọn để quay về template mặc định. Template sẽ thay đổi ngay lập tức trên toàn bộ giao diện.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availableTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => handleTemplateChange(template.id)}
              className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                currentTemplate.id === template.id
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/30'
                  : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
              }`}
            >
              {currentTemplate.id === template.id && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                  <CheckIcon className="w-4 h-4 text-white" />
                </div>
              )}
              
              {/* Preview */}
              <div className={`w-full h-24 ${template.preview} rounded-lg mb-4 flex items-center justify-center`}>
                <EyeIcon className="w-8 h-8 text-white/80" />
              </div>
              
              <h3 className={`font-semibold text-lg mb-2 ${currentTemplate.id === template.id ? 'text-purple-900 dark:text-purple-100' : 'text-gray-900 dark:text-white'}`}>
                {template.name}
              </h3>
              
              <p className={`text-sm mb-4 ${currentTemplate.id === template.id ? 'text-purple-700 dark:text-purple-300' : 'text-gray-600 dark:text-gray-400'}`}>
                {template.description}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {template.features.map((feature, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1 text-xs rounded-full ${
                      currentTemplate.id === template.id
                        ? 'bg-purple-200 text-purple-800 dark:bg-purple-800 dark:text-purple-200'
                        : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Color Theme Settings */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/30 dark:border-gray-700/30 shadow-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <SwatchIcon className="w-6 h-6 text-pink-600 dark:text-pink-400" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Chọn tông màu chủ đạo
          </h2>
        </div>
        
        <div className="mb-4 p-3 bg-pink-50 dark:bg-pink-950/30 rounded-lg border border-pink-200 dark:border-pink-800">
          <p className="text-sm text-pink-700 dark:text-pink-300">
            💡 <strong>Lưu ý:</strong> Click vào màu đã chọn để quay về màu mặc định. Màu sắc sẽ thay đổi ngay lập tức trên toàn bộ giao diện.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableThemes.map((theme) => (
            <div
              key={theme.id}
              onClick={() => handleThemeChange(theme.id)}
              className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                currentTheme.id === theme.id
                  ? 'border-pink-500 bg-pink-50 dark:bg-pink-950/30'
                  : 'border-gray-200 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-600'
              }`}
            >
              {currentTheme.id === theme.id && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                  <CheckIcon className="w-4 h-4 text-white" />
                </div>
              )}
              
              {/* Color Preview */}
              <div className="w-full h-16 rounded-lg mb-3 p-3" style={{ background: `linear-gradient(to bottom right, ${theme.cssVars['--color-primary-50']}, ${theme.cssVars['--color-primary-100']})` }}>
                <div className="w-full h-full bg-white rounded border-2 flex items-center justify-center" style={{ borderColor: theme.cssVars['--color-primary-100'] }}>
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.cssVars['--color-primary'] }}></div>
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.cssVars['--color-secondary'] }}></div>
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.cssVars['--color-accent'] }}></div>
                  </div>
                </div>
              </div>
              
              <h3 className={`font-medium mb-1 ${currentTheme.id === theme.id ? 'text-pink-900 dark:text-pink-100' : 'text-gray-900 dark:text-white'}`}>
                {theme.name}
              </h3>
              
              <div className="flex space-x-2 text-xs">
                <span className="px-2 py-1 text-white rounded" style={{ backgroundColor: theme.cssVars['--color-primary'] }}>Primary</span>
                <span className="px-2 py-1 text-white rounded" style={{ backgroundColor: theme.cssVars['--color-secondary'] }}>Secondary</span>
                <span className="px-2 py-1 text-white rounded" style={{ backgroundColor: theme.cssVars['--color-accent'] }}>Accent</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p><strong>Cài đặt hiện tại:</strong></p>
          <ul className="mt-2 space-y-1">
            <li>• Sao lưu: {selectedBackup ? backupSchedules.find(s => s.id === selectedBackup)?.label : 'Đã tắt'}</li>
            <li>• Template: {currentTemplate.name}</li>
                            <li>• Màu sắc: {currentTheme.name}</li>
          </ul>
        </div>
        
        <button 
          onClick={() => {
            alert('Cài đặt đã được lưu thành công!');
          }}
          className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          <div className="flex items-center space-x-2">
            <ServerIcon className="w-5 h-5" />
            <span>Lưu cài đặt</span>
          </div>
        </button>
      </div>
    </div>
  );
} 