import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quản lý môn học - MegaStart Online',
  description: 'Quản lý thông tin môn học trong hệ thống',
};

const SubjectTable = dynamic(
  () => import('@/features/subject/components').then(mod => ({ default: mod.SubjectTable })),
  {
    loading: () => <PageLoader isLoading={true} loadingText="Đang tải bảng môn học..." />
  }
);

export default function SubjectPage() {
  return <SubjectTable />;
} 