// src/validations/changePassword.schema.ts
import { z } from 'zod';

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().nonempty('Vui lòng nhập mật khẩu cũ'),

    newPassword: z
      .string()
      .min(8, 'Mật khẩu mới phải có ít nhất 8 ký tự')
      .regex(/^[A-Z]/, 'Mật khẩu phải bắt đầu bằng chữ in hoa')
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])/,
        'Mật khẩu phải chứa chữ, số và ký tự đặc biệt'
      ),

    confirmPassword: z.string().nonempty('Vui lòng nhập lại mật khẩu'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });
