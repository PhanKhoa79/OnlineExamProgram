'use client'
import { useState } from 'react'
import { InputOTPForm } from '@/features/auth/components/InputOtpForm'
import { Input } from '@/components/ui/input'
import { forgotPassword } from '@/features/auth/services/authService'
import { toast } from '@/components/hooks/use-toast'

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await forgotPassword(email)
      setStep('otp')
    } catch (err: any) {
      toast({
        title: error?.response?.data?.message || 'Có lỗi xảy ra',
        description: 'Email chưa đăng ký',
        variant: "error"
      })
    }
  }

  return (
      <div className="flex flex-col items-center">
        <h2 className="text-center text-2xl font-semibold mb-1">Lấy lại mật khẩu</h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          Nhập thông tin của bạn để tiếp tục
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
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="you@example.com"
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

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
  )
}
