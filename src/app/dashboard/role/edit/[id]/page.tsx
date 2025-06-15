'use client';

import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

const EditRolePage = dynamic(
  () => import('@/features/role/components/EditRolePage'),
  {
    loading: () => <PageLoader isLoading={true} loadingText="Đang tải form chỉnh sửa quyền..." />
  }
);

export default function EditRoleModalPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  return <EditRolePage id={id} />;
}
