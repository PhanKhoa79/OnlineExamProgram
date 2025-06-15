'use client';

import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

const AddAccountPage = dynamic(
  () => import('@/features/account/components/AddAccountPage'),
  {
    loading: () => <PageLoader isLoading={true} loadingText="Đang tải form tạo tài khoản..." />
  }
);

export default function AccountCreatePage() {
  return <AddAccountPage />;
}
