'use client';

import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

const EditQuestionPage = dynamic(
  () => import('@/features/question/components/EditQuestionPage'),
  {
    loading: () => <PageLoader isLoading={true} loadingText="Đang tải form chỉnh sửa câu hỏi..." />
  }
);

export default function DashBoardEditQuestionPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  return <EditQuestionPage id={id} />;
} 