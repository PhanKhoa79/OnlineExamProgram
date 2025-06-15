"use client";

import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';
import { useRouter } from 'next/navigation';

const DetailScheduleModal = dynamic(
  () => import('@/features/schedule/components/modal/DetailScheduleModal').then(mod => ({ default: mod.DetailScheduleModal })),
  {
    loading: () => <PageLoader isLoading={true} loadingText="Đang tải chi tiết lịch thi..." />
  }
);

export default function ScheduleDetailModalPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const id = Number(params.id);
  return <DetailScheduleModal id={id} open={true} onOpenChange={() => router.back()} />;
} 