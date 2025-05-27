"use client";

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";

type CustomConfirmModalProps = {
  title: string;
  onConfirm: () => void;
  children: React.ReactNode;
};

export const ConfirmDeleteModal = ({ title, onConfirm, children }: CustomConfirmModalProps) => {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>

        <DialogContent className="max-w-sm text-center">
          <DialogHeader>
            <div className="flex justify-center mb-2">
              <Trash2 className="w-10 h-10 text-gray-500" />
            </div>
            <p className="text-lg font-semibold text-center">{title}</p>
          </DialogHeader>

          <DialogFooter className="flex justify-center mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              No, cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirm}>
              Yes, I'm sure
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
