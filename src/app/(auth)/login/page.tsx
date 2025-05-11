import AuthForm from "@/features/auth/components/AuthForm";
import Link from "next/link";
export default function LoginPage() {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 to-white flex items-center justify-center">
        <div className="flex flex-col gap-4 w-full max-w-md bg-white/70 backdrop-blur-md shadow-xl rounded-3xl p-8 border border-gray-200">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl">
              ➡️
            </div>
          </div>
          <h2 className="text-center text-2xl font-semibold mb-1">Sign in</h2>
          <p className="text-center text-gray-500 text-sm mb-6">
            Welcome back! Please enter your information to continue.
          </p>
  
          <AuthForm />
          
          <Link  href="/forgot-password" className="mt-4 text-right text-sm text-sky-500 cursor-pointer hover:underline">
            Forgot password?
          </Link>
        </div>
      </div>
    );
  }
  