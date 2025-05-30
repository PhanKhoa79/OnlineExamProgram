'use client';

import { useState, useEffect } from 'react';
import { useRouter} from 'next/navigation';
import { resetPassword } from '../services/authService';
import AuthInput from '@/components/ui/AuthInput';
import HttpsIcon from '@mui/icons-material/Https';
import { schema as passwordSchema, getErrorMessage } from '@/lib/validationAuth';
import { toast } from '@/components/hooks/use-toast';
import { useResetPasswordStore } from '../store';

export default function ResetPasswordForm() {
  const { code } = useResetPasswordStore();
  console.log(code);
  const router = useRouter();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [newError, setNewError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  // ✅ validate real-time mật khẩu mới
  useEffect(() => {
    const { passwordError } = getErrorMessage(
      passwordSchema,
      { password: newPassword },
    );
    setNewError(passwordError);
  }, [newPassword]);

  // ✅ validate real-time confirmPassword
  useEffect(() => {
    if (!confirmPassword) {
      setConfirmError(null);
    } else if (newPassword !== confirmPassword) {
      setConfirmError('Mật khẩu xác nhận không đúng');
    } else {
      setConfirmError(null);
    }
  }, [newPassword, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // nếu có lỗi hiện tại, không submit
    if (newError || confirmError) return;
    try {
      await resetPassword(code, newPassword);
      toast({
        title: "Đổi mật khẩu thành công",
        description: "Bạn có thể đăng nhập với mật khẩu mới."
      })
      router.push('/login');
    } catch (err: any) {
        setServerError(err.response?.data?.message);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {serverError && <p className="text-red-500 text-sm">{serverError}</p>}

      <AuthInput
        id="new-password"
        label="Mật khẩu mới"
        type={showNew ? 'text' : 'password'}
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
        error={newError || ''}
        Icon={HttpsIcon}
        showPasswordToggle={() => setShowNew(p => !p)}
      />

      <AuthInput
        id="confirm-password"
        label="Xác nhận mật khẩu"
        type={showConfirm ? 'text' : 'password'}
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        error={confirmError || ''}
        Icon={HttpsIcon}
        showPasswordToggle={() => setShowConfirm(p => !p)}
      />

      <button
        type="submit"
        className="w-full mt-4 py-2 bg-black text-white rounded-md hover:bg-gray-900 transition"
      >
        Cập nhật mật khẩu
      </button>
    </form>
  );
}
