import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

const AddSchedulePage = dynamic(
  () => import('@/features/schedule/components/AddSchedulePage'),
  {
    loading: () => <PageLoader isLoading={true} loadingText="Đang tải form tạo lịch thi..." />
  }
);

export default function ScheduleCreatePage() {
  return <AddSchedulePage />;
} 