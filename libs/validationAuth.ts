import { z } from 'zod';

export const schema = z.object({
  email: z.string().min(1, "Please enter an email").email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters long").nonempty("Please enter a password"),
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
