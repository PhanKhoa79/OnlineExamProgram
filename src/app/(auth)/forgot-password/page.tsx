'use client'
import { useState } from 'react';
import { InputOTPForm } from '@/features/auth/components/InputOtpForm';
import { Input } from '@/components/ui/input';
import { forgotPassword } from '@/features/auth/services/authService';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await forgotPassword(email);
      setStep('otp'); 
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại!');
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-white flex items-center justify-center">
      <div className="flex flex-col items-center w-full max-w-md bg-white/70 backdrop-blur-md shadow-xl rounded-3xl p-8 border border-gray-200">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl">➡️</div>
        </div>
        <h2 className="text-center text-2xl font-semibold mb-1">Forgot Password</h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          Please enter your email to receive a reset code.
        </p>

        {step === 'email' ? (
          <form onSubmit={handleEmailSubmit} className="w-full space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email của bạn
              </label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="you@example.com"
                required
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Gửi mã xác thực
            </button>
          </form>
        ) : (
          <InputOTPForm email={email} />
        )}
      </div>
    </div>
  );
}
