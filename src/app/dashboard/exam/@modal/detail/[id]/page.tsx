'use client';

import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';
import { useRouter } from 'next/navigation';

const DetailExamModal = dynamic(
  () => import('@/features/exam/components/modal/DetailExamModal').then(mod => ({ default: mod.DetailExamModal })),
  {
    loading: () => <PageLoader isLoading={true} loadingText="Đang tải chi tiết bài thi..." />
  }
);

interface PageProps {
  params: Promise<{ id: string }>;
}

function DetailExamModalClient({ id }: { id: number }) {
  const router = useRouter();
  return (
    <DetailExamModal 
      examId={id} 
      isOpen={true} 
      onClose={() => router.back()} 
    />
  );
}

export default async function DetailExamModalPage({ params }: PageProps) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  return <DetailExamModalClient id={id} />;
} 