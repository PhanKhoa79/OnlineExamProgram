import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

const StudentTable = dynamic(
  () => import('@/features/student/ui/StudentTable').then(mod => ({ default: mod.StudentTable })),
  {
    loading: () => <PageLoader isLoading={true} loadingText="Đang tải bảng học sinh..." />
  }
);

export default function StudentPage() {
  return <StudentTable />;
} 