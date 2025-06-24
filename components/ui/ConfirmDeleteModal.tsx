"use client";

import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
type CustomConfirmModalProps = {
  title: string;
  open: boolean;
  onOpenChange: (value: boolean) => void;
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
};

export const ConfirmDeleteModal = ({ title, open, onOpenChange, onConfirm, isLoading = false }: CustomConfirmModalProps) => {

  const handleConfirm = async () => {
    try {
      await onConfirm();
      // Automatically close the modal after successful confirmation
      onOpenChange(false);
    } catch (error) {
      // If there's an error, keep the modal open so user can retry
      console.error('Error during confirmation:', error);
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={onOpenChange}>

        <DialogContent className="max-w-sm text-center">
          <DialogHeader>
            <div className="flex justify-center mb-2">
              <Trash2 className="w-10 h-10 text-gray-500" />
            </div>
            <p className="text-lg font-semibold text-center">{title}</p>
          </DialogHeader>

          <DialogFooter className="flex justify-center mt-4">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              className="cursor-pointer"
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirm} 
              className="cursor-pointer flex items-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Đang xóa...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Xác nhận xóa
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
