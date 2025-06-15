import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

const AddClassPage = dynamic(
  () => import('@/features/classes/components/AddClassPage'),
  {
    loading: () => <PageLoader isLoading={true} loadingText="Đang tải form tạo lớp học..." />
  }
);

export default function ClassCreatePage() {
  return <AddClassPage />;
} 