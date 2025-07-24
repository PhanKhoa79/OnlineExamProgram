'use client';

import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

const EditSubjectPage = dynamic(
  () => import('@/features/subject/components').then(mod => ({ default: mod.EditSubjectPage })),
  {
    loading: () => <PageLoader isLoading={true} loadingText="Đang tải form chỉnh sửa môn học..." />
  }
);

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DashBoardEditSubjectPage({ params }: PageProps) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  return <EditSubjectPage id={id} />;
}