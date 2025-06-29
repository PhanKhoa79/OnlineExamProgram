import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quản lý lịch thi - MegaStart Online',
  description: 'Quản lý lịch thi và thời gian biểu',
};

const ScheduleTable = dynamic(
  () => import('@/features/schedule/components/ScheduleTable').then(mod => ({ default: mod.ScheduleTable })),
  {
    loading: () => <PageLoader isLoading={true} loadingText="Đang tải bảng lịch thi..." />
  }
);

export default function DashboardSchedulePage() {
  return <ScheduleTable />;
} 