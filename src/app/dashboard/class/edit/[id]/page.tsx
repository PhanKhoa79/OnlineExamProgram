'use client';

import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

const EditClassPage = dynamic(
  () => import('@/features/classes/components/EditClassPage'),
  {
    loading: () => <PageLoader isLoading={true} loadingText="Đang tải form chỉnh sửa lớp học..." />
  }
);

export default function DashBoardEditClassPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  return <EditClassPage id={id} />;
}
