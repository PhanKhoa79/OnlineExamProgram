import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

const AddRolePage = dynamic(
  () => import('@/features/role/components/AddRolePage'),
  {
    loading: () => <PageLoader isLoading={true} loadingText="Đang tải form tạo quyền..." />
  }
);

export default function RoleCreatePage() {
  return <AddRolePage />;
}
