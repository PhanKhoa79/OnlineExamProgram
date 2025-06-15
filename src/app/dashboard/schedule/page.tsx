import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

const ScheduleTable = dynamic(
  () => import('@/features/schedule/components/ScheduleTable').then(mod => ({ default: mod.ScheduleTable })),
  {
    loading: () => <PageLoader isLoading={true} loadingText="Đang tải bảng lịch thi..." />
  }
);

export default function DashboardSchedulePage() {
  return <ScheduleTable />;
} 