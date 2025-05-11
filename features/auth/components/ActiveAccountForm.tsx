'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { activate } from '../services/authService';
import AuthInput from '@/components/ui/AuthInput';
import HttpsIcon from '@mui/icons-material/Https';
import { schema as passwordSchema, getErrorMessage } from '@/libs/validationAuth';

export default function ActiveAccountForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const router = useRouter();

  // State cho các input
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Show/hide
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Error messages
  const [currentError, setCurrentError] = useState<string | null>(null);
  const [newError, setNewError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  // ✅ validate real-time mật khẩu tạm thời
  useEffect(() => {
    const { passwordError } = getErrorMessage(
      passwordSchema,
      { password: currentPassword },
    );
    setCurrentError(passwordError);
  }, [currentPassword]);

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
    if (currentError || newError || confirmError) return;

    try {
      await activate(token, currentPassword, newPassword);
      router.push('/login');
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || 'Có lỗi xảy ra';
      if (msg.includes('tạm thời không đúng')) {
        setCurrentError('Mật khẩu tạm thời không đúng');
      } else {
        setServerError(msg);
      }
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {serverError && <p className="text-red-500 text-sm">{serverError}</p>}

      <AuthInput
        id="current-password"
        label="Mật khẩu tạm thời"
        type={showCurrent ? 'text' : 'password'}
        value={currentPassword}
        onChange={e => setCurrentPassword(e.target.value)}
        error={currentError || ''}
        Icon={HttpsIcon}
        showPasswordToggle={() => setShowCurrent(p => !p)}
      />

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
