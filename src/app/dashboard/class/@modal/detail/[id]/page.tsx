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

interface PageProps {
  params: Promise<{ id: string }>;
}

function DetailClassModalClient({ id }: { id: number }) {
  const router = useRouter();
  return <DetailClassModal id={id} open={true} onOpenChange={() => router.back()} />;
}

export default async function DetailClassModalPage({ params }: PageProps) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  return <DetailClassModalClient id={id} />;
} 