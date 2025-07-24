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

interface PageProps {
  params: Promise<{ id: string }>;
}

function DetailRoleModalClient({ id }: { id: number }) {
  const router = useRouter();
  return <DetailRoleModal id={id} open={true} onOpenChange={() => router.back()} />;
}

export default async function DetailRoleModalPage({ params }: PageProps) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  return <DetailRoleModalClient id={id} />;
}
