import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quản lý học sinh - MegaStart Online',
  description: 'Quản lý thông tin học sinh trong hệ thống',
};

const StudentTable = dynamic(
  () => import('@/features/student/ui/StudentTable').then(mod => ({ default: mod.StudentTable })),
  {
    loading: () => <PageLoader isLoading={true} loadingText="Đang tải bảng học sinh..." />
  }
);

export default function StudentPage() {
  return <StudentTable />;
} 