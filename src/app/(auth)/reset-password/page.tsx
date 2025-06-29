import ResetPasswordForm from '../../../../features/auth/components/ResetPasswordForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đặt lại mật khẩu - MegaStart Online',
  description: 'Đặt lại mật khẩu cho tài khoản của bạn',
};

export default function ResetPasswordPage() {
    return (
    <div>
      <h2 className="text-center text-2xl font-semibold mb-1">Đặt lại mật khẩu</h2>
      <p className="text-center text-gray-500 text-sm mb-6">
        Nhập thông tin của bạn để tiếp tục
      </p>
      <ResetPasswordForm />
    </div>
  );
}
  