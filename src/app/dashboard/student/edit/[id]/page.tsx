'use client';

import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

const DynamicEditStudentPage = dynamic(
  () => import('@/features/student/ui/EditStudentPage').then(mod => ({ default: mod.EditStudentPage })),
  {
    loading: () => <PageLoader isLoading={true} loadingText="Đang tải form chỉnh sửa học sinh..." />
  }
);

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditStudentPageWrapper({ params }: PageProps) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  return <DynamicEditStudentPage id={id} />;
} 