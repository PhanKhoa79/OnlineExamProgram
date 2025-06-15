import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/PageLoader';


const AccountTable = dynamic(
  () => import('@/features/account/components/AccountTable').then(mod => ({ default: mod.AccountTable })),
  {
    loading: () => <PageLoader isLoading={true} loadingText="Đang tải bảng tài khoản..." />
  }
);

export default function DashboardAccountPage() {
  return <AccountTable />;
}
