import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quản lý quyền - MegaStart Online',
  description: 'Quản lý phân quyền người dùng trong hệ thống',
};

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
