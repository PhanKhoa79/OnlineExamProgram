import { z } from 'zod';

// Custom phone number validation function
const phoneNumberValidation = z.string()
  .optional()
  .refine((value) => {
    // If no value provided, it's optional so it's valid
    if (!value || value === '') {
      return true;
    }
    
    // Check if only contains digits
    const isOnlyDigits = /^\d+$/.test(value);
    if (!isOnlyDigits) {
      return false;
    }
    
    // Check if starts with 0
    if (!value.startsWith('0')) {
      return false;
    }
    
    // Check if length is 10 or 11 digits
    if (value.length !== 10 && value.length !== 11) {
      return false;
    }
    
    return true;
  }, {
    message: "Số điện thoại phải bắt đầu bằng số 0, chỉ chứa số và có 10-11 chữ số"
  });

export const studentSchema = z.object({
  studentCode: z.string().min(1, "Vui lòng nhập mã sinh viên"),
  fullName: z.string().min(1, "Vui lòng nhập họ tên"),
  gender: z.enum(['Nam', 'Nữ', 'Khác'], { required_error: "Vui lòng chọn giới tính" }),
  dateOfBirth: z.string().min(1, "Vui lòng nhập ngày sinh"),
  phoneNumber: phoneNumberValidation,
  email: z.string().email("Định dạng email không đúng").optional().or(z.literal("")),
  address: z.string().optional(),
  classId: z.number().min(1, "Vui lòng chọn lớp học"),
});

export const getStudentErrorMessage = (values: { 
  studentCode: string; 
  fullName: string; 
  gender?: string;
  dateOfBirth: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  classId?: number;
}) => {
  const result = studentSchema.safeParse(values);

  if (result.success) {
    return {
      studentCodeError: null,
      fullNameError: null,
      genderError: null,
      dateOfBirthError: null,
      phoneNumberError: null,
      emailError: null,
      addressError: null,
      classIdError: null,
    };
  }

  const errors = result.error.format() as unknown as Record<string, { _errors: string[] }>;

  return {
    studentCodeError: errors.studentCode?._errors[0] || null,
    fullNameError: errors.fullName?._errors[0] || null,
    genderError: errors.gender?._errors[0] || null,
    dateOfBirthError: errors.dateOfBirth?._errors[0] || null,
    phoneNumberError: errors.phoneNumber?._errors[0] || null,
    emailError: errors.email?._errors[0] || null,
    addressError: errors.address?._errors[0] || null,
    classIdError: errors.classId?._errors[0] || null,
  };
}; 