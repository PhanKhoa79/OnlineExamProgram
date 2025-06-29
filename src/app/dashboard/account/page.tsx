import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quản lý tài khoản - MegaStart Online',
  description: 'Quản lý tài khoản người dùng trong hệ thống',
};

const AccountTable = dynamic(
  () => import('@/features/account/components/AccountTable').then(mod => ({ default: mod.AccountTable })),
  {
    loading: () => <PageLoader isLoading={true} loadingText="Đang tải bảng tài khoản..." />
  }
);

export default function DashboardAccountPage() {
  return <AccountTable />;
}
