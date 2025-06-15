'use client';

import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';
import { useRouter } from 'next/navigation';

const DetailQuestionModal = dynamic(
  () => import('@/features/question/components/modal/DetailQuestionModal').then(mod => ({ default: mod.DetailQuestionModal })),
  {
    loading: () => <PageLoader isLoading={true} loadingText="Đang tải chi tiết câu hỏi..." />
  }
);

export default function DetailQuestionModalPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const id = Number(params.id);
  return <DetailQuestionModal id={id} open={true} onOpenChange={() => router.back()} />;
} 