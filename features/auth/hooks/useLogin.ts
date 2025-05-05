"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/features/auth/services/authService";
import { schema, getErrorMessage } from "@/libs/validationAuth";

export default function useLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  // validate real-time
  useEffect(() => {
    const { emailError, passwordError } = getErrorMessage(schema, { email, password });
    setEmailError(emailError);
    setPasswordError(passwordError);
  }, [email, password]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    // re-validate trước khi submit
    const { emailError, passwordError } = getErrorMessage(schema, { email, password });
    setEmailError(emailError);
    setPasswordError(passwordError);
    if (emailError || passwordError) return;

    try {
      const res = await login(email, password);
      const role: string = res.data.user.role;
      
      // phân quyền
      if (role === "admin" || role === "teacher") {
        router.push("/dashboard");
      } else {
        router.push("/home");
      }
    } catch (err: any) {
      setLoginError(err.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  return {
    email, setEmail,
    password, setPassword,
    showPassword, setShowPassword,
    emailError, passwordError,
    loginError,
    handleLogin,
  };
}
