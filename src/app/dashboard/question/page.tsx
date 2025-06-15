import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

// Dynamic import with loading fallback
const QuestionTable = dynamic(
  () => import('@/features/question/components/QuestionTable').then(mod => ({ default: mod.QuestionTable })),
  {
    loading: () => <PageLoader isLoading={true} loadingText="Đang tải bảng câu hỏi..." />
  }
);

export default function DashboardQuestionPage() {
  return <QuestionTable />;
} 