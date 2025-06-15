"use client";

import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';
import { useRouter } from 'next/navigation';

const DetailStudentModal = dynamic(
  () => import('@/features/student/ui/modal/DetailStudentModal').then(mod => ({ default: mod.DetailStudentModal })),
  {
    loading: () => <PageLoader isLoading={true} loadingText="Đang tải chi tiết học sinh..." />
  }
);

export default function DetailStudentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const id = Number(params.id);
  return <DetailStudentModal id={id} open={true} onOpenChange={() => router.back()} />;
} 