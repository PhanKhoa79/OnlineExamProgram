import ActiveAccountForm from "@/features/auth/components/ActiveAccountForm";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kích hoạt tài khoản - MegaStart Online',
  description: 'Kích hoạt tài khoản để sử dụng hệ thống',
};

export default function ActivePage() {
    return (
      <div>
          <h2 className="text-center text-2xl font-semibold mb-1">Kích hoạt tài khoản</h2>
          <p className="text-center text-gray-500 text-sm mb-6">
            Nhập thông tin của bạn để tiếp tục
          </p>
          <ActiveAccountForm />
      </div>
    );
  }
  