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

interface PageProps {
  params: Promise<{ id: string }>;
}

function DetailStudentModalClient({ id }: { id: number }) {
  const router = useRouter();
  return <DetailStudentModal id={id} open={true} onOpenChange={() => router.back()} />;
}

export default async function DetailStudentPage({ params }: PageProps) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  return <DetailStudentModalClient id={id} />;
} 