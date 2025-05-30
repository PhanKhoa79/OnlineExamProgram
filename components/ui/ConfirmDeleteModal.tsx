"use client";

import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
type CustomConfirmModalProps = {
  title: string;
  open: boolean;
  onOpenChange: (value: boolean) => void;
  onConfirm: () => void;
};

export const ConfirmDeleteModal = ({ title, open, onOpenChange, onConfirm }: CustomConfirmModalProps) => {

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
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
            <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">
              No, cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirm} className="cursor-pointer">
              Yes, I&apos;m sure
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
