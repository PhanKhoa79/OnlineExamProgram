'use client';

import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';
import { useRouter } from 'next/navigation';

const DetailAccountModal = dynamic(
  () => import('@/features/account/components/modal/DetailAccountModal'),
  {
    loading: () => <PageLoader isLoading={true} loadingText="Đang tải chi tiết tài khoản..." />
  }
);

export default function DetailAccountModalPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const id = Number(params.id);
  return <DetailAccountModal id={id} open={true} onOpenChange={() => router.back()} />;
}
