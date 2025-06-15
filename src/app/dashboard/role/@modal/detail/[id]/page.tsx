'use client';

import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';
import { useRouter } from 'next/navigation';

const DetailRoleModal = dynamic(
  () => import('@/features/role/components/modal/DetailRoleModal').then(mod => ({ default: mod.DetailRoleModal })),
  {
    loading: () => <PageLoader isLoading={true} loadingText="Đang tải chi tiết quyền..." />
  }
);

export default function DetailRoleModalPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const id = Number(params.id);
  return <DetailRoleModal id={id} open={true} onOpenChange={() => router.back()} />;
}
