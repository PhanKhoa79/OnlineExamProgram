import ResetPasswordForm from '../../../../features/auth/components/ResetPasswordForm';

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
  