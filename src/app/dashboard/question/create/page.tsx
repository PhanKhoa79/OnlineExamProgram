import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

const AddQuestionPage = dynamic(
  () => import('@/features/question/components/AddQuestionPage'),
  {
    loading: () => <PageLoader isLoading={true} loadingText="Đang tải form tạo câu hỏi..." />
  }
);

export default function QuestionCreatePage() {
  return <AddQuestionPage />;
} 