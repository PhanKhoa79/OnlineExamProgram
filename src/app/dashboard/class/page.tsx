import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quản lý lớp học - MegaStart Online',
  description: 'Quản lý thông tin lớp học trong hệ thống',
};

// Dynamic import with loading fallback
const ClassTable = dynamic(
  () => import('@/features/classes/components/ClassTable').then(mod => ({ default: mod.ClassTable })),
  {
    loading: () => <PageLoader isLoading={true} loadingText="Đang tải bảng lớp học..." />
  }
);

export default function DashboardClassPage() {
  return <ClassTable />;
}
