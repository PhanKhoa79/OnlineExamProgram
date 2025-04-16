"use client";

import { useState } from "react";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import HttpsIcon from '@mui/icons-material/Https';

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const validateEmail = (value: string) => {
    if (!value) return "Vui lòng nhập email";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Email không hợp lệ";
    return null;
  };

  const validatePassword = (value: string) => {
    if (!value) return "Vui lòng nhập mật khẩu";
    if (value.length < 8) return "Mật khẩu phải có ít nhất 8 ký tự";
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);

    setEmailError(emailErr);
    setPasswordError(passErr);

    if (!emailErr && !passErr) {
      console.log("Đăng nhập thành công");

    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="relative w-full">
            <label htmlFor="email" className="block text-sm font-bold text-black-700 mb-1">
                Email
            </label>
            <div className="relative">
                <span className="absolute left-3 top-5 transform -translate-y-1/2 text-gray-400">
                    <EmailIcon fontSize="small" />
                </span>
                <input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError(validateEmail(e.target.value));
                    }}
                    onBlur={() => setEmailError(validateEmail(email))}
                    className={`w-full pl-10 pr-4 py-2 border rounded-md bg-white focus:outline-none ${
                        emailError ? "border-red-500" : "border-gray-300 focus:ring-2 focus:ring-sky-400"
                    }`}
                />
            </div>
        </div>

        <div className="relative w-full">
            <label htmlFor="password" className="block text-sm font-bold text-black-700 mb-1">
                Password
            </label>
            <div className="relative">
                <span className="absolute left-3 top-4.5 transform -translate-y-1/2 text-gray-400">
                    <HttpsIcon fontSize="small" />
                </span>
                <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordError(validatePassword(e.target.value));
                    }}
                    onBlur={() => setPasswordError(validatePassword(password))}
                    className={`w-full pl-10 px-4 py-2 border rounded-md bg-white focus:outline-none ${
                        passwordError ? "border-red-500" : "border-gray-300 focus:ring-2 focus:ring-sky-400"
                    }`}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer">
                    {showPassword ? (
                        <VisibilityIcon onClick={() => setShowPassword(false)} />
                    ) : (
                        <VisibilityOffIcon onClick={() => setShowPassword(true)} />
                    )}
                </div>
            </div>
            <div className="min-h-[1.25rem]">
                {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
            </div>
        </div>


        <div className="text-right text-sm text-sky-500 cursor-pointer hover:underline">
            Forgot password?
        </div>

        <button
            type="submit"
            className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-900 transition"
        >
            Login
        </button>
    </form>
  );
}
