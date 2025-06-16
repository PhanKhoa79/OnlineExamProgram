import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

// Dynamic import with loading fallback
const AddRoomPage = dynamic(
  () => import('@/features/room/components/AddRoomPage'),
  {
    loading: () => <PageLoader isLoading={true} loadingText="Đang tải trang thêm phòng thi..." />
  }
);

export default function CreateRoomPage() {
  return <AddRoomPage />;
} 