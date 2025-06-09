'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { HelpCircle, Plus, Edit, Trash2, Download, Upload, AlertCircle, CheckCircle, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/features/auth/store';
import { hasPermission } from '@/lib/permissions';
import * as Tabs from '@radix-ui/react-tabs';

interface ValidationRule {
  field: string;
  rules: string[];
  examples?: string[];
}

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'date' | 'number' | 'textarea' | 'radio' | 'file' | 'treeview' | 'checkbox-list' | 'dynamic-list' | 'url' | 'color' | 'color-picker' | 'color-picker-list' | 'color-picker-list-dynamic' | 'color-picker-list-dynamic-list' | 'color-picker-list-dynamic-list-dynamic-list' | 'color-picker-list-dynamic-list-dynamic-list-dynamic-list';
  required: boolean;
  validation?: ValidationRule;
  options?: string[];
  description?: string;
  placeholder?: string;
}

export interface DetailedInstruction {
  operation: 'create' | 'edit' | 'delete';
  title: string;
  description: string;
  permission?: string;
  formFields?: FormField[];
  steps: string[];
  tips?: string[];
  warnings?: string[];
  additionalNotes?: string[];
}

interface TabbedHelpModalProps {
  featureName: string;
  entityName: string;
  permissions?: {
    create?: string;
    edit?: string;
    delete?: string;
    export?: string;
    import?: string;
  };
  detailedInstructions: DetailedInstruction[];
}

const operationIcons = {
  create: <Plus className="h-5 w-5 text-green-600" />,
  edit: <Edit className="h-5 w-5 text-blue-600" />,
  delete: <Trash2 className="h-5 w-5 text-red-600" />
};

const getFieldTypeIcon = (type: string) => {
  switch (type) {
    case 'email': return '📧';
    case 'password': return '🔒';
    case 'select': return '📋';
    case 'radio': return '⚪';
    case 'file': return '📁';
    case 'date': return '📅';
    case 'number': return '🔢';
    case 'textarea': return '📝';
    default: return '✏️';
  }
};

export function TabbedHelpModal({ 
  featureName, 
  entityName, 
  permissions, 
  detailedInstructions 
}: TabbedHelpModalProps) {
  const [open, setOpen] = useState(false);
  
  // Get user's actual permissions from auth store
  const userPermissions = useAuthStore((state) => state.permissions);

  // General instructions (simplified version)
  const getGeneralInstructions = () => {
    const instructions = [];

    // Add Create instruction
    if (!permissions?.create || hasPermission(userPermissions, permissions.create)) {
      instructions.push({
        title: `Thêm ${entityName}`,
        icon: <Plus className="h-5 w-5 text-green-600" />,
        description: `Hướng dẫn cách thêm ${entityName} mới`,
        steps: [
          `Nhấn vào nút "+ Thêm ${entityName}" ở góc trên bên phải`,
          'Điền đầy đủ thông tin vào form',
          'Kiểm tra lại thông tin đã nhập',
          'Nhấn "Lưu" hoặc "Lưu & Thoát" để hoàn tất'
        ]
      });
    }

    // Add Edit instruction
    if (!permissions?.edit || hasPermission(userPermissions, permissions.edit)) {
      instructions.push({
        title: `Sửa ${entityName}`,
        icon: <Edit className="h-5 w-5 text-blue-600" />,
        description: `Hướng dẫn cách chỉnh sửa ${entityName}`,
        steps: [
          `Tìm ${entityName} cần sửa trong bảng`,
          'Nhấn vào biểu tượng bút chì (✏️) ở cột "Hành động"',
          'Chỉnh sửa thông tin cần thiết',
          'Nhấn "Lưu" hoặc "Lưu & Thoát" để cập nhật'
        ]
      });
    }

    // Add Delete instruction
    if (!permissions?.delete || hasPermission(userPermissions, permissions.delete)) {
      instructions.push({
        title: `Xóa ${entityName}`,
        icon: <Trash2 className="h-5 w-5 text-red-600" />,
        description: `Hướng dẫn cách xóa ${entityName}`,
        steps: [
          `Tìm ${entityName} cần xóa trong bảng`,
          'Nhấn vào biểu tượng thùng rác (🗑️) ở cột "Hành động"',
          'Xác nhận việc xóa trong hộp thoại',
          '⚠️ Lưu ý: Thao tác này không thể hoàn tác!'
        ]
      });
    }

    // Always add search and export
    instructions.push(
      {
        title: 'Tìm kiếm và lọc',
        icon: <Search className="h-5 w-5 text-purple-600" />,
        description: 'Hướng dẫn cách tìm kiếm và lọc dữ liệu',
        steps: [
          'Sử dụng ô tìm kiếm để nhập từ khóa',
          'Chọn bộ lọc phù hợp (nếu có)',
          'Nhấn "Xóa bộ lọc" để reset tất cả filter',
          'Sử dụng "Cột" để ẩn/hiện các cột không cần thiết'
        ]
      },
      {
        title: 'Xuất dữ liệu',
        icon: <Download className="h-5 w-5 text-indigo-600" />,
        description: 'Hướng dẫn xuất dữ liệu ra Excel/CSV',
        steps: [
          'Nhấn nút "Xuất" để tải dữ liệu về Excel/CSV',
          'Chọn định dạng file phù hợp (Excel hoặc CSV)',
          'File sẽ được tự động tải về máy tính',
          'Mở file để xem và sử dụng dữ liệu'
        ]
      }
    );

    // Add import if create permission exists
    if (permissions?.create && hasPermission(userPermissions, permissions.create)) {
      instructions.push({
        title: 'Nhập dữ liệu từ Excel/CSV',
        icon: <Upload className="h-5 w-5 text-green-600" />,
        description: 'Hướng dẫn nhập dữ liệu từ file Excel hoặc CSV',
        steps: [
          'Nhấn nút "Nhập" và chọn loại file (Excel hoặc CSV)',
          'Chọn file Excel (.xlsx) hoặc CSV (.csv) từ máy tính',
          'Kiểm tra preview dữ liệu trước khi nhập',
          'Nhấn "Xác nhận" để thêm dữ liệu vào hệ thống',
          '💡 Lưu ý: Đảm bảo format file đúng theo mẫu'
        ]
      });
    }

    return instructions;
  };

  const filteredDetailedInstructions = detailedInstructions.filter((instruction) => {
    if (!instruction.permission) return true;
    return hasPermission(userPermissions, instruction.permission);
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 border-gray-300 hover:border-gray-400 cursor-pointer"
        >
          <HelpCircle className="h-4 w-4" />
          Hướng dẫn
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Hướng dẫn sử dụng - {featureName}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Hướng dẫn chi tiết cách thêm, sửa, xóa và quản lý {entityName.toLowerCase()}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs.Root defaultValue="general" className="w-full">
          <Tabs.List className="flex space-x-4 border-b pb-2 mb-6 text-sm font-medium">
            <Tabs.Trigger 
              value="general" 
              className="px-4 py-2 border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 transition-colors"
            >
              📖 Hướng dẫn tổng quát
            </Tabs.Trigger>
            <Tabs.Trigger 
              value="detailed" 
              className="px-4 py-2 border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 transition-colors"
            >
              📋 Hướng dẫn chi tiết
            </Tabs.Trigger>
          </Tabs.List>

          {/* Tab 1: Tổng quát */}
          <Tabs.Content value="general" className="space-y-6">
            <div className="grid gap-6">
              {getGeneralInstructions().map((instruction, index) => (
                <Card key={index} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {instruction.icon}
                      {instruction.title}
                    </CardTitle>
                    <CardDescription>{instruction.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ol className="list-decimal list-inside space-y-2">
                      {instruction.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="text-sm text-gray-700 leading-relaxed">
                          {step}
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              ))}
              
              {/* General Tips */}
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg text-blue-800">
                    💡 Mẹo sử dụng chung
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1 text-sm text-blue-700">
                    <li>Sử dụng phím tắt Ctrl+F để tìm kiếm nhanh trên trang</li>
                    <li>Click vào tiêu đề cột để sắp xếp dữ liệu</li>
                    <li>Dữ liệu được cập nhật realtime khi có thay đổi</li>
                    <li>Kiểm tra quyền truy cập nếu không thấy một số chức năng</li>
                    <li>Sử dụng &quot;Lưu & Thoát&quot; để quay về danh sách sau khi lưu</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </Tabs.Content>

          {/* Tab 2: Chi tiết */}
          <Tabs.Content value="detailed" className="space-y-8">
            <div className="grid gap-8">
              {filteredDetailedInstructions.map((instruction, index) => (
                <Card key={index} className="border-l-4 border-l-green-500">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      {operationIcons[instruction.operation]}
                      {instruction.title}
                    </CardTitle>
                    <CardDescription className="text-base">{instruction.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Form Fields Section */}
                    {instruction.formFields && instruction.formFields.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold mb-4 text-gray-800">📋 Các trường trong form:</h4>
                        <div className="grid gap-4">
                          {instruction.formFields.map((field, fieldIndex) => (
                            <div key={fieldIndex} className="border rounded-lg p-4 bg-gray-50">
                              <div className="flex items-center gap-3 mb-3">
                                <span className="text-lg">{getFieldTypeIcon(field.type)}</span>
                                <h5 className="font-medium text-gray-900">{field.label}</h5>
                                {field.required && (
                                  <Badge variant="destructive" className="text-xs">Bắt buộc</Badge>
                                )}
                                <Badge variant="outline" className="text-xs">{field.type}</Badge>
                              </div>
                              
                              {field.description && (
                                <p className="text-sm text-gray-600 mb-2">{field.description}</p>
                              )}

                              {field.placeholder && (
                                <div className="mb-2">
                                  <p className="text-sm font-medium text-gray-700 mb-1">Placeholder:</p>
                                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">{field.placeholder}</code>
                                </div>
                              )}
                              
                              {field.validation && (
                                <div className="mb-2">
                                  <p className="text-sm font-medium text-gray-700 mb-1">Validation:</p>
                                  <ul className="text-sm text-gray-600 space-y-1">
                                    {field.validation.rules.map((rule, ruleIndex) => (
                                      <li key={ruleIndex} className="flex items-start gap-2">
                                        <AlertCircle className="h-3 w-3 text-amber-500 mt-0.5 flex-shrink-0" />
                                        {rule}
                                      </li>
                                    ))}
                                  </ul>
                                  
                                  {field.validation.examples && field.validation.examples.length > 0 && (
                                    <div className="mt-2">
                                      <p className="text-sm font-medium text-gray-700 mb-1">Ví dụ hợp lệ:</p>
                                      <div className="flex flex-wrap gap-1">
                                        {field.validation.examples.map((example, exampleIndex) => (
                                          <code key={exampleIndex} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                            {example}
                                          </code>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                              
                              {field.options && field.options.length > 0 && (
                                <div className="mb-2">
                                  <p className="text-sm font-medium text-gray-700 mb-1">Tùy chọn:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {field.options.map((option, optionIndex) => (
                                      <Badge key={optionIndex} variant="secondary" className="text-xs">
                                        {option}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Steps Section */}
                    <div>
                      <h4 className="text-lg font-semibold mb-4 text-gray-800">🔢 Các bước thực hiện:</h4>
                      <ol className="list-decimal list-inside space-y-3">
                        {instruction.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="text-sm text-gray-700 leading-relaxed pl-2">
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Tips Section */}
                    {instruction.tips && instruction.tips.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold mb-4 text-green-800">💡 Mẹo hữu ích:</h4>
                        <ul className="space-y-2">
                          {instruction.tips.map((tip, tipIndex) => (
                            <li key={tipIndex} className="flex items-start gap-2 text-sm text-green-700">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Warnings Section */}
                    {instruction.warnings && instruction.warnings.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold mb-4 text-red-800">⚠️ Lưu ý quan trọng:</h4>
                        <ul className="space-y-2">
                          {instruction.warnings.map((warning, warningIndex) => (
                            <li key={warningIndex} className="flex items-start gap-2 text-sm text-red-700">
                              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                              {warning}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Additional Notes Section */}
                    {instruction.additionalNotes && instruction.additionalNotes.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold mb-4 text-blue-800">📝 Ghi chú thêm:</h4>
                        <ul className="space-y-2">
                          {instruction.additionalNotes.map((note, noteIndex) => (
                            <li key={noteIndex} className="flex items-start gap-2 text-sm text-blue-700">
                              <span className="text-blue-500 mt-0.5">•</span>
                              {note}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
              
              {/* Additional General Tips for Detailed Tab */}
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg text-blue-800">
                    🎯 Lưu ý khi sử dụng form
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1 text-sm text-blue-700">
                    <li>Kiểm tra kỹ thông tin trước khi lưu</li>
                    <li>Các trường có dấu (*) là bắt buộc phải điền</li>
                    <li>Nếu gặp lỗi validation, đọc kỹ thông báo lỗi</li>
                    <li>Sử dụng Ctrl+S để lưu nhanh trong form</li>
                    <li>Liên hệ admin nếu cần hỗ trợ thêm</li>
                    <li>Dữ liệu sẽ được validate realtime khi nhập</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </DialogContent>
    </Dialog>
  );
} 