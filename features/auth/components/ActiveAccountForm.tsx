'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { activate, verifyActivationToken, requestActivation, getEmailByActivationToken } from '../services/authService';
import AuthInput from '@/components/ui/AuthInput';
import HttpsIcon from '@mui/icons-material/Https';
import { schema as passwordSchema, getErrorMessage } from '@/lib/validationAuth';
import { toast } from '@/components/hooks/use-toast';
import Link from 'next/link';

// Define error type
interface ApiError {
  response?: {
    data?: {
      message?: string;
      statusCode?: number;
      error?: string;
      email?: string;
    };
  };
  message?: string;
}

export default function ActiveAccountForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const router = useRouter();

  // State for token validation
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [email, setEmail] = useState('');

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

  // Verify token validity when component mounts
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsTokenValid(false);
        setTokenError('Token kích hoạt không hợp lệ');
        setIsLoading(false);
        return;
      }

      try {
        // Lấy thông tin email từ token trước
        try {
          const emailResponse = await getEmailByActivationToken(token);
          if (emailResponse && emailResponse.data && emailResponse.data.email) {
            setEmail(emailResponse.data.email);
          }
        } catch (error) {
          console.log("Không thể lấy email từ token:", error);
        }

        // Kiểm tra tính hợp lệ của token
        const response = await verifyActivationToken(token);
        
        // Kiểm tra kết quả từ API
        if (!response.data || response.data.valid === false) {
          setIsTokenValid(false);
          setTokenError(response.data?.message || 'Token đã hết hạn hoặc không hợp lệ');
          setIsLoading(false);
          return;
        }
        
        // Token hợp lệ
        setIsTokenValid(true);
      } catch (err: unknown) {
        console.error('Token verification error:', err);
        setIsTokenValid(false);
        const error = err as ApiError;
        setTokenError(error?.response?.data?.message || error.message || 'Token đã hết hạn hoặc không hợp lệ');
        
        // Không cần kiểm tra email trong response lỗi vì đã lấy trước đó
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  // Xử lý khi người dùng yêu cầu gửi lại mã kích hoạt
  const handleRequestActivation = async () => {
    try {
      setIsSubmittingRequest(true);
      
      // Nếu chưa có email, thử lấy từ token
      if (!email) {
        try {
          const emailResponse = await getEmailByActivationToken(token);
          if (!emailResponse.data || !emailResponse.data.email) {
            throw new Error("Không tìm thấy email liên kết với token này");
          }
          
          await requestActivation(emailResponse.data.email);
        } catch (error) {
          toast({
            title: "Lỗi",
            description: "Không tìm thấy email liên kết với token này. Vui lòng liên hệ quản trị viên.",
            variant: "error"
          });
          setIsSubmittingRequest(false);
          return;
        }
      } else {
        // Sử dụng email đã có
        await requestActivation(email);
      }
      
      toast({
        title: "Thành công",
        description: "Yêu cầu kích hoạt tài khoản đã được gửi đến quản trị viên.",
        variant: "success"
      });
    } catch (err: unknown) {
      const error = err as ApiError;
      const msg = error?.response?.data?.message || error.message || 'Không thể gửi yêu cầu kích hoạt tài khoản.';
      toast({
        title: "Lỗi",
        description: msg,
        variant: "error"
      });
    } finally {
      setIsSubmittingRequest(false);
    }
  };

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

    // Kiểm tra lại tính hợp lệ của token trước khi submit
    try {
      await verifyActivationToken(token);
    } catch (err) {
      setIsTokenValid(false);
      setTokenError('Token đã hết hạn hoặc không hợp lệ');
      return;
    }

    // nếu có lỗi hiện tại, không submit
    if (currentError || newError || confirmError) return;

    try {
      await activate(token, currentPassword, newPassword);
      toast({ 
        title: 'Kích hoạt tài khoản thành công',
        variant: "success"
      });
      router.push('/login');
    } catch (err: unknown) {
      const error = err as ApiError;
      const msg = error?.response?.data?.message || error.message || 'Có lỗi xảy ra';
      if (msg.includes('tạm thời không đúng')) {
        setCurrentError('Mật khẩu tạm thời không đúng');
      } else if (msg.includes('hết hạn') || msg.includes('không hợp lệ')) {
        // Nếu lỗi liên quan đến token hết hạn, cập nhật trạng thái token
        setIsTokenValid(false);
        setTokenError(msg);
      } else {
        setServerError(msg);
      }
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">Đang kiểm tra tính hợp lệ của link kích hoạt...</p>
      </div>
    );
  }

  // Show error state if token is invalid
  if (!isTokenValid) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Link kích hoạt đã hết hạn</h2>
        <p className="text-gray-600 mb-6">{tokenError || 'Link kích hoạt tài khoản đã hết hạn hoặc không hợp lệ.'}</p>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
          <h3 className="font-semibold text-gray-700 mb-2">Bạn cần làm gì?</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Liên hệ với giáo viên hoặc quản trị viên để được cấp lại link kích hoạt mới</li>
            <li>Cung cấp email đã đăng ký của bạn cho quản trị viên</li>
            <li>Kiểm tra email của bạn sau khi được cấp lại link mới</li>
          </ul>
        </div>
        
        <div className="flex flex-col space-y-3">
          <Link 
            href="/login" 
            className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Quay lại trang đăng nhập
          </Link>
          
          <button 
            onClick={handleRequestActivation}
            disabled={isSubmittingRequest}
            className="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmittingRequest ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang gửi...
              </span>
            ) : "Gửi lại yêu cầu kích hoạt tài khoản"}
          </button>
        </div>
      </div>
    );
  }

  // Show the activation form if token is valid
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
