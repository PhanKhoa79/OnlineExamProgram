'use client';

import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

const EditRolePage = dynamic(
  () => import('@/features/role/components/EditRolePage'),
  {
    loading: () => <PageLoader isLoading={true} loadingText="Đang tải form chỉnh sửa quyền..." />
  }
);

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditRoleModalPage({ params }: PageProps) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  return <EditRolePage id={id} />;
}
