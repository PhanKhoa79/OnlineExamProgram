'use client';

import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

const EditExamPage = dynamic(
  () => import('@/features/exam/components/EditExamPage'),
  {
    loading: () => <PageLoader isLoading={true} loadingText="Đang tải form chỉnh sửa bài thi..." />
  }
);

export default function DashBoardEditExamPage() {
  return <EditExamPage />;
} 