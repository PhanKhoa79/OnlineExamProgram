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

interface PageProps {
  params: Promise<{ id: string }>;
}

function DetailSubjectModalClient({ id }: { id: number }) {
  const router = useRouter();
  return <DetailSubjectModal id={id} open={true} onOpenChange={() => router.back()} />;
}

export default async function DetailSubjectModalPage({ params }: PageProps) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  return <DetailSubjectModalClient id={id} />;
} 