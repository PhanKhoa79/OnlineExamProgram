"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ExamScheduleDto } from "../../types/schedule";

interface CancelScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule: ExamScheduleDto | null;
  onConfirm: (reason: string) => void;
}

export const CancelScheduleModal: React.FC<CancelScheduleModalProps> = ({
  open,
  onOpenChange,
  schedule,
  onConfirm,
}) => {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!reason.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(reason.trim());
      setReason("");
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setReason("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Hủy lịch thi</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn hủy lịch thi &quot;{schedule?.code}&quot;?
            <br />
            Vui lòng nhập lý do hủy lịch thi.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="reason">Lý do hủy *</Label>
            <Textarea
              id="reason"
              placeholder="Nhập lý do hủy lịch thi..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-2"
              rows={4}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Không
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!reason.trim() || isSubmitting}
          >
            {isSubmitting ? "Đang hủy..." : "Hủy lịch thi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 