import AuthForm from "@/features/auth/components/AuthForm";
import Link from "next/link";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đăng nhập - MegaStart Online',
  description: 'Đăng nhập vào hệ thống thi trắc nghiệm trực tuyến',
};

export default function LoginPage() {
    return (
      <div>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Đăng nhập</h2>
          <p className="text-gray-600 text-sm">
            Nhập thông tin của bạn để tiếp tục
          </p>
        </div>
        
        <div className="space-y-6">
          <AuthForm />
          
          <div className="text-center">
            <Link
              href="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors duration-200"
            >
              Quên mật khẩu?
            </Link>
          </div>
        </div>
      </div>    
  );
}
  