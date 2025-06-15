import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';

// Dynamic import with loading fallback
const RoleTable = dynamic(
  () => import('@/features/role/components/RoleTable').then(mod => ({ default: mod.RoleTable })),
  {
    loading: () => <PageLoader isLoading={true} loadingText="Đang tải bảng quyền..." />
  }
);

export default function DashboardRolePage() {
  return <RoleTable />;
}
