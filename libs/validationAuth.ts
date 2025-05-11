import { z } from 'zod';

export const schema = z.object({
  email: z.string().min(1, "Vui lòng nhập email").email("Định dạng email không đúng"),
  password: z.string().min(8, "Mật khẩu phải dài ít nhất 8 ký tự").nonempty("Vui lòng nhập mật khẩu"),
});

export const getErrorMessage = (schema: z.ZodSchema<any>, values: any) => {
  const result = schema.safeParse(values);

  if (result.success) {
    return {
      emailError: null,
      passwordError: null
    };
  }

  const errors = result.error.format();

  return {
    emailError: errors.email?._errors[0] || null,
    passwordError: errors.password?._errors[0] || null
  };
};
