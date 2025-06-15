import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

const AddSubjectPage = dynamic(
  () => import('@/features/subject/components').then(mod => ({ default: mod.AddSubjectPage })),
  {
    loading: () => <PageLoader isLoading={true} loadingText="Đang tải form tạo môn học..." />
  }
);

export default function SubjectCreatePage() {
  return <AddSubjectPage />;
} 