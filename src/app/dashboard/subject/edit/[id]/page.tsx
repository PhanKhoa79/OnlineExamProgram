'use client';

import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

const EditSubjectPage = dynamic(
  () => import('@/features/subject/components').then(mod => ({ default: mod.EditSubjectPage })),
  {
    loading: () => <PageLoader isLoading={true} loadingText="Đang tải form chỉnh sửa môn học..." />
  }
);

export default function DashBoardEditSubjectPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  return <EditSubjectPage id={id} />;
}