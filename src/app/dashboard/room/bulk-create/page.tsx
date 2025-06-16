import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

// Dynamic import with loading fallback
const BulkCreateRoomPage = dynamic(
  () => import('@/features/room/components/BulkCreateRoomPage'),
  {
    loading: () => <PageLoader isLoading={true} loadingText="Đang tải trang tạo phòng thi hàng loạt..." />
  }
);

export default function BulkCreateRoomPageRoute() {
  return <BulkCreateRoomPage />;
} 