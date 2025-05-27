'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { verifyResetCode } from "../services/authService"
import { toast } from "@/components/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation' 
import { useResetPasswordStore } from "../store"
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

export function InputOTPForm({ email }: InputOTPFormProps) {
  const router = useRouter()
  const { setResetInfo } = useResetPasswordStore()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  })

    async function onSubmit( data: z.infer<typeof FormSchema>) {
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
    } catch (error: any) {
      toast({
        title: 'Xác thực thất bại',
        description: error?.response?.data?.message || 'Có lỗi xảy ra',
        variant: "error"
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Please enter the one-time password sent to {email}.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
