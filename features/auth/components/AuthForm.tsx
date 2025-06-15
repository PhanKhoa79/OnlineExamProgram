"use client";

import AuthInput from "@/components/ui/AuthInput";
import EmailIcon from "@mui/icons-material/Email";
import HttpsIcon from "@mui/icons-material/Https";
import useLogin from "@/features/auth/hooks/useLogin";

export default function AuthForm() {
  const {
    email, setEmail,
    password, setPassword,
    showPassword, setShowPassword,
    emailError, passwordError,
    loginError,
    handleLogin,
  } = useLogin();

  return (
    <form className="space-y-5" onSubmit={handleLogin}>
      {loginError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 font-medium">{loginError}</p>
            </div>
          </div>
        </div>
      )}

      <AuthInput
        id="email"
        label="Email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        error={emailError}
        Icon={EmailIcon}
      />

      <AuthInput
        id="password"
        label="Mật khẩu"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={e => setPassword(e.target.value)}
        error={passwordError}
        Icon={HttpsIcon}
        showPasswordToggle={() => setShowPassword(!showPassword)}
      />

      <button
        type="submit"
        className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all duration-200 transform hover:-translate-y-0.5"
      >
        <span className="flex items-center justify-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
          Đăng nhập
        </span>
      </button>
    </form>
  );
}
