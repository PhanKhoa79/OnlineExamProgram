import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

const SubjectTable = dynamic(
  () => import('@/features/subject/components').then(mod => ({ default: mod.SubjectTable })),
  {
    loading: () => <PageLoader isLoading={true} loadingText="Đang tải bảng môn học..." />
  }
);

export default function SubjectPage() {
  return <SubjectTable />;
} 