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

interface PageProps {
  params: Promise<{ id: string }>; // Khớp với kiểu của Next.js
}

function DetailAccountModalClient({ id }: { id: number }) {
  const router = useRouter();
  return <DetailAccountModal id={id} open={true} onOpenChange={() => router.back()} />;
}

export default async function DetailAccountModalPage({ params }: PageProps) {
  const { id: idParam } = await params; // Await Promise để lấy object
  const id = Number(idParam);
  return <DetailAccountModalClient id={id} />;
}