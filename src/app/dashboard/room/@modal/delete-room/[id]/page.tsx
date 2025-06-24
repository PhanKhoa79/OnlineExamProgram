'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { deleteRoom } from '@/features/room/services/roomServices';
import { toast } from "@/components/hooks/use-toast";

export default function DeleteRoomModalPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const handleConfirmDelete = async () => {
    try {
      setIsLoading(true);
      await deleteRoom(id);
      
      toast({ 
        title: 'Xóa phòng thi thành công!',
        description: 'Phòng thi đã được xóa khỏi hệ thống.',
      });
      
      // Trigger refresh event for RoomTable
      window.dispatchEvent(new CustomEvent('roomDeleted'));
      
      // Close modal and navigate back
      setIsOpen(false);
      setTimeout(() => {
        router.replace('/dashboard/room');
      }, 100);
      
    } catch (err: unknown) {
      console.error("Error deleting room:", err);
      
      let errorMessage = "Có lỗi xảy ra khi xóa phòng thi. Vui lòng thử lại.";
      
      if (err && typeof err === 'object') {
        const errorObj = err as {
          response?: {
            data?: {
              message?: string;
              error?: string;
            };
          };
          message?: string;
        };
        if (errorObj?.response?.data?.message) {
          errorMessage = errorObj.response.data.message;
        } else if (errorObj?.response?.data?.error) {
          errorMessage = errorObj.response.data.error;
        } else if (errorObj?.message) {
          errorMessage = errorObj.message;
        }
      }

      toast({
        title: 'Lỗi khi xóa phòng thi',
        description: errorMessage,
        variant: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ConfirmDeleteModal
      title="Bạn có chắc chắn muốn xóa phòng thi này?"
      open={isOpen}
      onConfirm={handleConfirmDelete}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          router.back();
        }
      }}
      isLoading={isLoading}
    />
  );
} 