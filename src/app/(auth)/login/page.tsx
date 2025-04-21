import Image from "next/image";
import AuthForm from "@/features/auth/components/AuthForm";
export default function LoginPage() {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 to-white flex items-center justify-center">
        <div className="w-full max-w-md bg-white/70 backdrop-blur-md shadow-xl rounded-3xl p-8 border border-gray-200">
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
  
          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="mx-4 text-sm text-gray-400">Or sign in with</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>
  
          <div className="flex justify-center gap-4">
            <button className="border border-gray-300 p-2 rounded-full hover:bg-gray-100">
              <Image src="/google-icon.svg" alt="Google" width={25}  height={25}/>
            </button>
          </div>
        </div>
      </div>
    );
  }
  