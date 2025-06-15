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

export default function DetailExamModalPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const id = Number(params.id);

  return (
    <DetailExamModal 
      examId={id} 
      isOpen={true} 
      onClose={() => router.back()} 
    />
  );
} 