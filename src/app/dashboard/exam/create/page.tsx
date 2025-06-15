import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

const AddExamPage = dynamic(
  () => import('@/features/exam/components/AddExamPage'),
  {
    loading: () => <PageLoader isLoading={true} loadingText="Đang tải form tạo bài thi..." />
  }
);

export default function ExamCreatePage() {
  return <AddExamPage />;
} 