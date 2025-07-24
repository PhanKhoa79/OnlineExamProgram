'use client';

import React, { useState, useRef, useCallback } from 'react';
import { CustomModal } from '@/components/ui/CustomModal';
import { toast } from '@/components/hooks/use-toast';
import { CloudDownloadIcon, Upload, FileText, X, CheckCircle } from "lucide-react";
import { downloadTemplateFile } from '@/features/student/services/studentService';

export type FileType = 'xlsx' | 'csv';

export const StudentImportFileModal = ({
  open,
  setOpen,
  fileType,
  handleImport,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fileType: FileType | null;
  handleImport: (file: File, fileType: FileType) => Promise<void>;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = useCallback((selectedFile: File) => {
    const allowedTypes = fileType === 'xlsx' 
      ? ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
      : ['text/csv'];
    
    const allowedExtensions = fileType === 'xlsx' ? ['.xlsx'] : ['.csv'];
    const fileExtension = selectedFile.name.toLowerCase().slice(selectedFile.name.lastIndexOf('.'));
    
    if (!allowedTypes.includes(selectedFile.type) && !allowedExtensions.includes(fileExtension)) {
      toast({
        title: `Chỉ chấp nhận file .${fileType}`,
        variant: 'error',
      });
      return;
    }

    setFile(selectedFile);
  }, [fileType]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      validateAndSetFile(droppedFiles[0]);
    }
  }, [validateAndSetFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !fileType) {
      toast({
        title: 'Vui lòng chọn file và loại file!',
        variant: 'error',
      });
      return;
    }

    try {
      setLoading(true);
      await handleImport(file, fileType);  
      setOpen(false);
      setFile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = async (e?: React.MouseEvent) => {
    if (e) {
        e.stopPropagation();  
    }
    if (!fileType) {
      toast({
        title: 'Vui lòng chọn loại file để tải file mẫu!',
        variant: 'error',
      });
      return;
    }
    try {
      await downloadTemplateFile(fileType);
      toast({
        title: 'Tải file mẫu thành công!',
      });
    } catch (error) {
      let errorMessage = 'Lỗi khi tải file mẫu!';
      if (error instanceof Error) {
        errorMessage = `Lỗi: ${error.message}`;
      } else if (typeof error === 'object' && error !== null) {
        errorMessage = `Lỗi server: ${JSON.stringify(error)}`;
      }
      
      toast({
        title: errorMessage,
        variant: 'error',
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <CustomModal
      open={open}
      setOpen={setOpen}
      title={`Nhập sinh viên từ file ${fileType === 'xlsx' ? 'Excel' : 'CSV'}`}
      onSubmit={handleSubmit}
      submitLabel={`Nhập ${fileType === 'xlsx' ? 'Excel' : 'CSV'}`}
      contentClassName="lg:min-w-[600px] w-[500px]"
      loading={loading}
    >
      <div className="space-y-6">
        {/* Download Template Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <CloudDownloadIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Tải file mẫu sinh viên
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Tải xuống file mẫu để biết đúng định dạng dữ liệu sinh viên cần import
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
            >
              <CloudDownloadIcon className="w-4 h-4" />
              Tải mẫu
            </button>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Chọn file {fileType?.toUpperCase()} để nhập sinh viên
          </label>
          
          {/* Drag & Drop Zone */}
          <div
            className={`
              relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
              ${isDragOver 
                ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/20' 
                : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }
              ${file ? 'border-green-400 bg-green-50 dark:bg-green-950/20' : ''}
            `}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={fileType === 'xlsx' ? '.xlsx' : '.csv'}
              onChange={handleFileChange}
              className="hidden"
            />
            
            {!file ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className={`
                    w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-300
                    ${isDragOver ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-700'}
                  `}>
                    <Upload className={`
                      w-8 h-8 transition-colors duration-300
                      ${isDragOver ? 'text-blue-500' : 'text-gray-400'}
                    `} />
                  </div>
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {isDragOver ? 'Thả file vào đây' : 'Kéo thả file hoặc click để chọn'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Chỉ chấp nhận file .{fileType} (tối đa 10MB)
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                </div>
                <div>
                  <p className="text-lg font-medium text-green-700 dark:text-green-400">
                    File đã được chọn!
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Click để chọn file khác
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Selected File Preview */}
          {file && (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(file.size)} • {fileType?.toUpperCase()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(URL.createObjectURL(file), "_blank");
                    }}
                    className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                  >
                    Xem trước
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile();
                    }}
                    className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-amber-800">!</span>
              </div>
            </div>
            <div className="text-sm text-amber-800 dark:text-amber-200">
              <p className="font-medium">Lưu ý quan trọng:</p>
              <ul className="mt-2 space-y-1 list-disc list-inside text-xs">
                <li>Đảm bảo file tuân thủ đúng định dạng mẫu sinh viên</li>
                <li>Email sinh viên không được trùng lặp</li>
                <li>Mã sinh viên phải duy nhất trong hệ thống</li>
                <li>Hệ thống sẽ báo lỗi nếu có dữ liệu không hợp lệ</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </CustomModal>
  );
}; 