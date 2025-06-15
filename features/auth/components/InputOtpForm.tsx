'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { verifyResetCode, forgotPassword } from "../services/authService"
import { toast } from "@/components/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation' 
import { useResetPasswordStore } from "../store"
import { useState, useEffect } from "react"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

const FormSchema = z.object({
  pin: z.string().length(6, {
    message: "Your one-time password must be 6 characters.",
  }),
})

interface InputOTPFormProps {
  email: string
}

const MAX_RESEND_ATTEMPTS = 5;

export function InputOTPForm({ email }: InputOTPFormProps) {
  const router = useRouter()
  const { setResetInfo } = useResetPasswordStore()
  const [countdown, setCountdown] = useState(0)
  const [isResending, setIsResending] = useState(false)
  const [resendCount, setResendCount] = useState(0)
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  })

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      // verify mã
      await verifyResetCode(data.pin)
      setResetInfo(email, data.pin);
      toast({
        title: "Mã xác thực đã được xác nhận",
        description: "Bạn có thể đặt lại mật khẩu mới.",
        variant: "success"
      })
      router.push('/reset-password');
    } catch (error: unknown) {
      const errorMsg = error && typeof error === 'object' && 
        'response' in error && 
        error.response && 
        typeof error.response === 'object' && 
        'data' in error.response && 
        error.response.data && 
        typeof error.response.data === 'object' && 
        'message' in error.response.data ? 
        error.response.data.message as string : 
        'Có lỗi xảy ra';
      
      toast({
        title: 'Xác thực thất bại',
        description: errorMsg,
        variant: "error"
      })
    }
  }

  const handleResendCode = async () => {
    if (countdown > 0 || isResending) return
    
    // Check if maximum resend attempts reached
    if (resendCount >= MAX_RESEND_ATTEMPTS) {
      toast({
        title: "Đã vượt quá giới hạn",
        description: `Bạn chỉ được gửi lại mã tối đa ${MAX_RESEND_ATTEMPTS} lần. Vui lòng thử lại sau.`,
        variant: "error"
      })
      return
    }
    
    try {
      setIsResending(true)
      await forgotPassword(email)
      setResendCount(prevCount => prevCount + 1)
      setCountdown(30) // Start 30 second countdown
      toast({
        title: "Đã gửi lại mã OTP",
        description: `Vui lòng kiểm tra email của bạn. Còn lại ${MAX_RESEND_ATTEMPTS - (resendCount + 1)} lần gửi lại.`,
        variant: "success"
      })
    } catch (error: unknown) {
      const errorMsg = error && typeof error === 'object' && 
        'response' in error && 
        error.response && 
        typeof error.response === 'object' && 
        'data' in error.response && 
        error.response.data && 
        typeof error.response.data === 'object' && 
        'message' in error.response.data ? 
        error.response.data.message as string : 
        'Có lỗi xảy ra khi gửi lại mã';
      
      toast({
        title: 'Gửi lại mã thất bại',
        description: errorMsg,
        variant: "error"
      })
    } finally {
      setIsResending(false)
    }
  }

  const isResendDisabled = countdown > 0 || isResending || resendCount >= MAX_RESEND_ATTEMPTS;

  return (
    <div className="w-full max-w-md mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormLabel className="text-center block text-base font-semibold text-gray-700">One-Time Password</FormLabel>
                <FormControl>
                  <div className="flex justify-center">
                    <InputOTP maxLength={6} {...field} className="gap-3">
                      <InputOTPGroup>
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                          <InputOTPSlot 
                            key={index} 
                            index={index} 
                            className="w-12 h-14 text-lg font-semibold rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </FormControl>
                <FormDescription className="text-center text-sm text-gray-600">
                  Please enter the one-time password sent to <span className="font-medium text-blue-600">{email}</span>.
                </FormDescription>
                <FormMessage className="text-center" />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <span className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Xác nhận
            </span>
          </Button>
        </form>
      </Form>
      
      <div className="mt-6 text-center">
        <button 
          type="button" 
          onClick={handleResendCode}
          disabled={isResendDisabled}
          className={`text-sm font-medium transition-colors duration-200 ${
            isResendDisabled
              ? "text-gray-400 cursor-not-allowed"
              : "text-blue-600 hover:text-blue-800 hover:underline"
          }`}
        >
          {isResending ? (
            "Đang gửi..."
          ) : countdown > 0 ? (
            <>Gửi lại mã sau <span className="font-bold">{countdown}s</span></>
          ) : resendCount >= MAX_RESEND_ATTEMPTS ? (
            "Đã hết lượt gửi lại"
          ) : (
            `Gửi lại mã (${resendCount}/${MAX_RESEND_ATTEMPTS})`
          )}
        </button>
        
        {countdown > 0 && (
          <div className="mt-2 text-xs text-gray-500">
            Mã OTP sẽ hết hạn trong vòng <span className="font-medium">{countdown} giây</span>
          </div>
        )}
        
        {resendCount > 0 && resendCount < MAX_RESEND_ATTEMPTS && (
          <div className="mt-2 text-xs text-gray-500">
            Đã sử dụng {resendCount}/{MAX_RESEND_ATTEMPTS} lần gửi lại
          </div>
        )}
        
        {resendCount >= MAX_RESEND_ATTEMPTS && (
          <div className="mt-2 text-xs text-red-500 font-medium">
            Bạn đã sử dụng hết {MAX_RESEND_ATTEMPTS} lần gửi lại mã
          </div>
        )}
      </div>
    </div>
  )
}
