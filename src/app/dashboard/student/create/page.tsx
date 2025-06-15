import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

const AddStudentPage = dynamic(
  () => import('@/features/student/ui/AddStudentPage').then(mod => ({ default: mod.AddStudentPage })),
  {
    loading: () => <PageLoader isLoading={true} loadingText="Đang tải form tạo học sinh..." />
  }
);

export default function StudentCreatePage() {
  return <AddStudentPage />;
} 