'use client';

import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

const EditAccountPage = dynamic(
  () => import('@/features/account/components/EditAccoutPage'),
  {
    loading: () => <PageLoader isLoading={true} loadingText="Đang tải form chỉnh sửa tài khoản..." />
  }
);

interface PageProps {
  params: Promise<{ id: string }>; // Khớp với kiểu của Next.js
}

export default async function AccountEditPage({ params }: PageProps) {
  const { id: idParam } = await params; // Await Promise để lấy object
  const id = Number(idParam);
  return <EditAccountPage id={id} />;
}