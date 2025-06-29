import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quản lý bài thi - MegaStart Online',
  description: 'Quản lý bài thi và đề thi trong hệ thống',
};

// Dynamic import with loading fallback
const ExamTable = dynamic(
  () => import('@/features/exam/components/ExamTable').then(mod => ({ default: mod.ExamTable })),
  {
    loading: () => <PageLoader isLoading={true} loadingText="Đang tải bảng bài thi..." />
  }
);

export default function DashboardExamPage() {
  return <ExamTable />;
} 