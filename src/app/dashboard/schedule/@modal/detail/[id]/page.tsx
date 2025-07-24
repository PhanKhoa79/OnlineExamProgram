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

interface PageProps {
  params: Promise<{ id: string }>;
}

function ScheduleDetailModalClient({ id }: { id: number }) {
  const router = useRouter();
  return <DetailScheduleModal id={id} open={true} onOpenChange={() => router.back()} />;
}

export default async function ScheduleDetailModalPage({ params }: PageProps) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  return <ScheduleDetailModalClient id={id} />;
} 