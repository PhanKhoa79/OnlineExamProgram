import { z } from 'zod';

export const schema = z.object({
  email: z.string().min(1, "Vui lòng nhập email").email("Định dạng email không đúng"),
  password: z.string().min(8, "Mật khẩu phải dài ít nhất 8 ký tự").nonempty("Vui lòng nhập mật khẩu"),
  accountname: z.string().nonempty("Vui lòng nhập tên tài khoản"),
  roleName: z.string().nonempty("Vui lòng nhập tên quyền"),
  className: z.string().nonempty("Vui lòng nhập tên lớp học"),
  codeClass: z.string().nonempty("Vui lòng nhập mã lớp học"),
});

// 👇 Đặt type chính xác từ schema
type FormData = z.infer<typeof schema>;

// 👇 Cập nhật hàm để nhận đúng schema và giá trị
export const getErrorMessage = (schema: z.ZodType<FormData>, values: FormData) => {
  const result = schema.safeParse(values);

  if (result.success) {
    return {
      emailError: null,
      passwordError: null,
      accountnameError: null,
      roleNameError: null,
      classNameError: null,
      codeClassError: null,
    };
  }

  const errors = result.error.format();

  return {
    emailError: errors.email?._errors[0] || null,
    passwordError: errors.password?._errors[0] || null,
    accountnameError: errors.accountname?._errors[0] || null,
    roleNameError: errors.roleName?._errors[0] || null,
    classNameError: errors.className?._errors[0] || null,
    codeClassError: errors.codeClass?._errors[0] || null,
  };
};

