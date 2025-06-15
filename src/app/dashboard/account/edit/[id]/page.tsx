'use client';

import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

const EditAccountPage = dynamic(
  () => import('@/features/account/components/EditAccoutPage'),
  {
    loading: () => <PageLoader isLoading={true} loadingText="Đang tải form chỉnh sửa tài khoản..." />
  }
);

export default function AccountEditPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  return <EditAccountPage id={id} />;
}
