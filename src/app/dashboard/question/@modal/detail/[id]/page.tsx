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

interface PageProps {
  params: Promise<{ id: string }>;
}

function DetailQuestionModalClient({ id }: { id: number }) {
  const router = useRouter();
  return <DetailQuestionModal id={id} open={true} onOpenChange={() => router.back()} />;
}

export default async function DetailQuestionModalPage({ params }: PageProps) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  return <DetailQuestionModalClient id={id} />;
} 