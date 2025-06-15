'use client';

import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';
import { useRouter } from 'next/navigation';

const DetailClassModal = dynamic(
  () => import('@/features/classes/components/modal/DetailClassModal').then(mod => ({ default: mod.DetailClassModal })),
  {
    loading: () => <PageLoader isLoading={true} loadingText="Đang tải chi tiết lớp học..." />
  }
);

export default function DetailClassModalPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const id = Number(params.id);
  return <DetailClassModal id={id} open={true} onOpenChange={() => router.back()} />;
} 