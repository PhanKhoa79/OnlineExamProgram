import AuthForm from "@/features/auth/components/AuthForm";
import Link from "next/link";
export default function LoginPage() {
    return (
      <div>
        <h2 className="text-center text-2xl font-semibold mb-1">Đăng nhập</h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          Nhập thông tin của bạn để tiếp tục
        </p>
        <div className="flex flex-col gap-4">
          <AuthForm />
            <Link
              href="/forgot-password"
              className="mt-4 text-right text-sm text-sky-500 cursor-pointer hover:underline"
            >
              Forgot password?
            </Link>
        </div>
      </div>    
  );
}
  