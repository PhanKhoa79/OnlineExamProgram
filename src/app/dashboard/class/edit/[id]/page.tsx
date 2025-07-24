'use client';

import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

const EditClassPage = dynamic(
  () => import('@/features/classes/components/EditClassPage'),
  {
    loading: () => <PageLoader isLoading={true} loadingText="Đang tải form chỉnh sửa lớp học..." />
  }
);

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DashBoardEditClassPage({ params }: PageProps) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  return <EditClassPage id={id} />;
}
