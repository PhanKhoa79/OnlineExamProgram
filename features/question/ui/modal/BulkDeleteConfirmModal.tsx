"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, AlertTriangle } from "lucide-react";

interface BulkDeleteConfirmModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedCount: number;
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
}

export function BulkDeleteConfirmModal({
  open,
  setOpen,
  selectedCount,
  onConfirm,
  isLoading = false,
}: BulkDeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsDeleting(true);
      await onConfirm();
      setOpen(false);
    } catch (error) {
      console.error("Error during bulk delete:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    if (!isDeleting) {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Xác nhận xóa câu hỏi
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Bạn có chắc chắn muốn xóa <span className="font-semibold text-red-600">{selectedCount}</span> câu hỏi đã chọn không?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-700">
                <p className="font-medium mb-1">Cảnh báo:</p>
                <p>Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan đến các câu hỏi này sẽ bị xóa vĩnh viễn.</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isDeleting || isLoading}
            className="cursor-pointer"
          >
            Hủy bỏ
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting || isLoading}
            className="cursor-pointer flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Đang xóa...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Xóa {selectedCount} câu hỏi
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 