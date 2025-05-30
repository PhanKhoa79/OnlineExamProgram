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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
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
      title={`Nhập file ${fileType === 'xlsx' ? 'Excel' : 'CSV'}`}
      onSubmit={handleSubmit}
      submitLabel={`Nhập ${fileType === 'xlsx' ? 'Excel' : 'CSV'}`}
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
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
          />

          {file && (
            <div className="relative border border-gray-300 rounded p-4 flex items-center justify-between bg-gray-50">
              <div>
                <p className="text-sm font-medium text-gray-800">{file.name}</p>
                <button
                  onClick={() => window.open(URL.createObjectURL(file), "_blank")}
                  className="text-blue-600 text-xs hover:underline"
                >
                  Xem file
                </button>
              </div>
              <button
                onClick={handleRemoveFile}
                className="absolute top-1 right-1 text-gray-400 hover:text-red-500"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>
    </CustomModal>
  );
};