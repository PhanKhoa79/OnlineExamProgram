'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/features/auth/store';
import { changePassword, getLoginHistoryByAccountId } from '@/features/auth/services/authService';
import { changePasswordSchema } from '@/lib/chagePasswordSchema';
import { toast } from '@/components/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  Key,
  Info,
  Monitor,
  Clock,
  MapPin,
  Smartphone
} from 'lucide-react';

interface LoginHistoryEntry {
  loginTime: string;
  ipAddress: string;
  userAgent: string;
}

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

  const [loginHistory, setLoginHistory] = useState<LoginHistoryEntry[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const user = useAuthStore((state) => state.user);
  const idAccountCur = user?.id;

  // Fetch login history
  useEffect(() => {
    const fetchLoginHistory = async () => {
      try {
        setIsLoadingHistory(true);
        if (idAccountCur !== undefined) {
          const res = await getLoginHistoryByAccountId(idAccountCur);
          console.log('Login history:', res);
          setLoginHistory(res.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch login history:', error);
        setLoginHistory([]);
      } finally {
        setIsLoadingHistory(false);
      }
    };
    fetchLoginHistory();
  }, [idAccountCur]);

  // Validate password form
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
      toast({ 
        title: 'Đổi mật khẩu thành công',
        variant: 'success' 
      });
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

  const formatUserAgent = (userAgent: string) => {
    if (userAgent.toLowerCase().includes('mobile') || userAgent.toLowerCase().includes('android') || userAgent.toLowerCase().includes('iphone')) {
      return { icon: <Smartphone className="w-4 h-4" />, text: 'Thiết bị di động' };
    }
    return { icon: <Monitor className="w-4 h-4" />, text: 'Máy tính' };
  };

  const formatTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return timeString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 via-pink-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Bảo mật tài khoản</h1>
            <p className="text-red-100">Quản lý mật khẩu và lịch sử đăng nhập</p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Account Info */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5 text-blue-600" />
              Thông tin tài khoản
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user?.accountname || 'Tên tài khoản'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user?.email || 'email@example.com'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-xl border border-yellow-200 dark:border-yellow-700/50">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                    Lưu ý bảo mật
                  </h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Hãy sử dụng mật khẩu mạnh và không chia sẻ thông tin đăng nhập với ai khác.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Change Password Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-red-600" />
              Mật khẩu
            </CardTitle>
            <div className="flex items-center justify-between">
              <CardDescription>
                Cập nhật mật khẩu để bảo vệ tài khoản của bạn
              </CardDescription>
              <Button
                variant="link"
                className="text-blue-600 px-0"
                onClick={() => setShowChangePassword(!showChangePassword)}
              >
                {showChangePassword ? 'Ẩn' : 'Đổi mật khẩu'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {showChangePassword && (
              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Old Password */}
                <div className="space-y-2">
                  <Label htmlFor="oldPassword">Mật khẩu hiện tại</Label>
                  {oldPasswordError && (
                    <p className="text-sm text-red-600">{oldPasswordError}</p>
                  )}
                  <div className="relative">
                    <Input
                      id="oldPassword"
                      type={showOldPassword ? 'text' : 'password'}
                      placeholder="Nhập mật khẩu hiện tại"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                    >
                      {showOldPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Mật khẩu mới</Label>
                  {newPasswordError && (
                    <p className="text-sm text-red-600">{newPasswordError}</p>
                  )}
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="Nhập mật khẩu mới"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                  {confirmPasswordError && (
                    <p className="text-sm text-red-600">{confirmPasswordError}</p>
                  )}
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Nhập lại mật khẩu mới"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  <Lock className="w-4 h-4 mr-2" />
                  Đổi mật khẩu
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Login History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-green-600" />
            Lịch sử đăng nhập
          </CardTitle>
          <CardDescription>
            Theo dõi các lần đăng nhập gần đây vào tài khoản của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingHistory ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
              <span className="ml-2 text-gray-600">Đang tải lịch sử...</span>
            </div>
          ) : loginHistory.length > 0 ? (
            <div className="space-y-4">
              {loginHistory.map((entry, idx) => {
                const deviceInfo = formatUserAgent(entry.userAgent);
                return (
                  <div key={idx} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                      {deviceInfo.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {deviceInfo.text}
                        </span>
                        {idx === 0 && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                            Hiện tại
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(entry.loginTime)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{entry.ipAddress}</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                        {entry.userAgent}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                Chưa có lịch sử đăng nhập
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 