import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

// Dynamic import with loading fallback
const EditRoomPage = dynamic(
  () => import('@/features/room/components/EditRoomPage'),
  {
    loading: () => <PageLoader isLoading={true} loadingText="Đang tải trang chỉnh sửa phòng thi..." />
  }
);

export default function EditRoomPageRoute() {
  return <EditRoomPage />;
} 