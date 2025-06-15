'use client';

import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';
import { useRouter } from 'next/navigation';

const DetailSubjectModal = dynamic(
  () => import('@/features/subject/components/modal/DetailSubjectModal').then(mod => ({ default: mod.DetailSubjectModal })),
  {
    loading: () => <PageLoader isLoading={true} loadingText="Đang tải chi tiết môn học..." />
  }
);

export default function DetailSubjectModalPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const id = Number(params.id);
  return <DetailSubjectModal id={id} open={true} onOpenChange={() => router.back()} />;
} 