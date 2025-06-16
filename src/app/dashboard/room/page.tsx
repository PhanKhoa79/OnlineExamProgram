import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

// Dynamic import with loading fallback
const RoomTable = dynamic(
  () => import('@/features/room/components/RoomTable').then(mod => ({ default: mod.RoomTable })),
  {
    loading: () => <PageLoader isLoading={true} loadingText="Đang tải bảng phòng thi..." />
  }
);

export default function DashboardRoomPage() {
  return <RoomTable />;
} 