'use client';

import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';
import { useRouter } from 'next/navigation';

const ListStudentModal = dynamic(
  () => import('@/features/account/components/modal/ListStudentModal'),
  {
    loading: () => <PageLoader isLoading={true} loadingText="Đang tải form upload học sinh..." />
  }
);

export default function UploadStudentModalPage() {
  const router = useRouter();

  return (
    <ListStudentModal open={true} onOpenChange={() => router.back()} />
  );
}
