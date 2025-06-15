import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

const EditSchedulePage = dynamic(
  () => import('@/features/schedule/components/EditSchedulePage'),
  {
    loading: () => <PageLoader isLoading={true} loadingText="Đang tải form chỉnh sửa lịch thi..." />
  }
);

export default function ScheduleEditPage() {
  return <EditSchedulePage />;
} 