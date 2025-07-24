'use client';

import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

const EditQuestionPage = dynamic(
  () => import('@/features/question/components/EditQuestionPage'),
  {
    loading: () => <PageLoader isLoading={true} loadingText="Đang tải form chỉnh sửa câu hỏi..." />
  }
);

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DashBoardEditQuestionPage({ params }: PageProps) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  return <EditQuestionPage id={id} />;
} 