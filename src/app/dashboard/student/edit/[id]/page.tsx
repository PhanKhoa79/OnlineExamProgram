'use client';

import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

const DynamicEditStudentPage = dynamic(
  () => import('@/features/student/ui/EditStudentPage').then(mod => ({ default: mod.EditStudentPage })),
  {
    loading: () => <PageLoader isLoading={true} loadingText="Đang tải form chỉnh sửa học sinh..." />
  }
);

export default function EditStudentPageWrapper({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  return <DynamicEditStudentPage id={id} />;
} 