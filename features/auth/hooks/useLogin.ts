"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/features/auth/services/authService";
import { schema, getErrorMessage } from "@/lib/validationAuth";
import { useAuthStore } from "../store";

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
      const role: string = res.data.user.role.name;
      const user = res.data.user;
      useAuthStore.getState().setAuthInfo(user);
      // phân quyền
      if (role === "student") {
        router.push("/home");
      } else {
        router.push("/dashboard");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
