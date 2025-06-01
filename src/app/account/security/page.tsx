'use client';

import { useState ,useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import { toast } from '@/components/hooks/use-toast';
import { changePassword, getLoginHistoryByAccountId } from '@/features/auth/services/authService';
import { changePasswordSchema } from '@/lib/chagePasswordSchema';
import { useAuthStore } from '@/features/auth/store';

export default function SecurityPage() {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [oldPasswordError, setOldPasswordError] = useState<string | null>(null);
  const [newPasswordError, setNewPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  const [loginHistory, setLoginHistory] = useState<string[]>([]);

  const idAccountCur = useAuthStore.getState().user?.id;

  useEffect(() => {
    const fetchAccountAndPermissions = async () => {
        try {
          if(idAccountCur !== undefined) {
            const res = await getLoginHistoryByAccountId(idAccountCur);
            console.log(res);
            setLoginHistory(res.data);
          }
        } catch (error) {
            console.error('Failed to fetch login history:', error);
        }
    };
    fetchAccountAndPermissions();
  }, [idAccountCur]);

  useEffect(() => {
    const result = changePasswordSchema.safeParse({
      oldPassword,
      newPassword,
      confirmPassword,
    });

    if (result.success) {
      setOldPasswordError(null);
      setNewPasswordError(null);
      setConfirmPasswordError(null);
    } else {
      const errors = result.error.format();
      setOldPasswordError(errors.oldPassword?._errors[0] || null);
      setNewPasswordError(errors.newPassword?._errors[0] || null);
      setConfirmPasswordError(errors.confirmPassword?._errors[0] || null);
    }
  }, [oldPassword, newPassword, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = changePasswordSchema.safeParse({
      oldPassword,
      newPassword,
      confirmPassword,
    });
    if (!result.success) return;

    try {
      await changePassword(oldPassword, newPassword);
      toast({ title: 'Đổi mật khẩu thành công' });
      setShowChangePassword(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      const msg = error?.response?.data?.message ?? 'Đổi mật khẩu thất bại, vui lòng thử lại';
      if (Array.isArray(msg)) {
        msg.forEach((m: string) => toast({ title: m, variant: 'error' }));
      } else {
        toast({ title: msg, variant: 'error' });
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-semibold">Bảo mật</h1>

      <section className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-medium">Mật khẩu</h2>
          <Button
            variant="link"
            className="text-blue-600 px-0"
            onClick={() => setShowChangePassword(!showChangePassword)}
          >
            {showChangePassword ? 'Ẩn' : 'Đổi mật khẩu'}
          </Button>
        </div>

        {showChangePassword && (
          <form className="space-y-4 mt-2" onSubmit={handleSubmit}>
            {/* Old Password */}
            <div className="space-y-1">
              {oldPasswordError && (
                <p className="text-sm text-red-600">{oldPasswordError}</p>
              )}
              <div className="relative">
                <Input
                  className="h-10"
                  type={showOldPassword ? 'text' : 'password'}
                  placeholder="Old password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                <IconButton
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="!absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showOldPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1">
              {newPasswordError && (
                <p className="text-sm text-red-600">{newPasswordError}</p>
              )}
              <div className="relative">
                <Input
                  className="h-10"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <IconButton
                  type="button"
                  className="!absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              {confirmPasswordError && (
                <p className="text-sm text-red-600">{confirmPasswordError}</p>
              )}
              <div className="relative">
                <Input
                  className="h-10"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <IconButton
                  type="button"
                  className="!absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </div>
            </div>

            <Button type="submit" className="mt-2">
              Đổi mật khẩu
            </Button>
          </form>
        )}
      </section>

      <Separator />

      {/* Active devices */}
      <section className="space-y-2">
        <h2 className="text-base font-medium">Thiết bị đăng nhập</h2>
        {loginHistory.length > 0 ? (
           <div className="relative border-l-2 border-gray-200">
              {loginHistory.map((entry, idx) => (
                <div key={idx} className="ml-4 mb-6">
                  <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-1.5 top-1.5"></div>
                  <time className="text-sm font-medium text-gray-800">{entry.loginTime}</time>
                  <div className="text-sm text-gray-600">{entry.ipAddress}</div>
                  <div className="text-xs text-gray-500">{entry.userAgent}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 italic">Chưa có lịch sử đăng nhập.</div>
          )}
      </section>

      <Separator />
    </div>
  );
}
