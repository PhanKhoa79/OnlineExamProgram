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
    <form className="space-y-4" onSubmit={handleLogin}>
      {loginError && (
        <p className="text-red-500 text-sm">{loginError}</p>
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
        label="Password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={e => setPassword(e.target.value)}
        error={passwordError}
        Icon={HttpsIcon}
        showPasswordToggle={() => setShowPassword(!showPassword)}
      />

      <button
        type="submit"
        className="w-full mt-4 py-2 bg-black text-white rounded-md hover:bg-gray-900 transition"
      >
        Đăng nhập
      </button>
    </form>
  );
}
