'use client';

import React, { useState } from 'react';
import { CustomModal } from '@/components/ui/CustomModal';
import { toast } from '@/components/hooks/use-toast';
import { CloudDownloadIcon} from "lucide-react";
import { downloadTemplateFile } from '@/features/account/services/accountService';
export type FileType = 'xlsx' | 'csv';

export const ImportFileModal = ({
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

  const handleDownloadTemplate = async () => {
    if (!fileType) {
      toast({
        title: 'Vui lòng chọn loại file để tải file mẫu!',
        variant: 'error',
      });
      return;
    }
    try {
      await downloadTemplateFile(fileType);
    } catch (error) {
      console.error('Lỗi khi tải file mẫu:', error);
      toast({
        title: 'Lỗi khi tải file mẫu!',
        variant: 'error',
      });
    }
  };

  return (
    <CustomModal
      open={open}
      setOpen={setOpen}
      title={`Import ${fileType === 'xlsx' ? 'Excel' : 'CSV'}`}
      onSubmit={handleSubmit}
      submitLabel={`Import ${fileType === 'xlsx' ? 'Excel' : 'CSV'}`}
      contentClassName="lg:min-w-[900px] h-[600px] w-[600px]"
      loading={loading}
    >
      <div className="flex flex-col gap-4">
        <div
          className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:bg-gray-50 transition"
          onClick={handleDownloadTemplate}
        >
          <CloudDownloadIcon className="w-12 h-12 text-gray-400" />
          <p className="mt-2 text-base font-medium text-gray-700">Tải file mẫu</p>
          <p className="text-sm text-gray-500">Click để tải xuống file mẫu đúng định dạng</p>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="file-upload" className="text-sm font-medium text-gray-700">
            Chọn file
          </label>

          <input
            id="file-upload"
            type="file"
            accept={fileType === 'xlsx' ? '.xlsx' : '.csv'}
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="hidden"
          />

          <label
            htmlFor="file-upload"
            className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            📁 Chọn file từ máy
          </label>

          {file && <p className="text-sm text-green-600">Đã chọn file: {file.name}</p>}
        </div>
      </div>
    </CustomModal>
  );
};