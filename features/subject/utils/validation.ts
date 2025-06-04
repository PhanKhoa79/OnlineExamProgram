import { z } from 'zod';

export const subjectSchema = z.object({
  subjectName: z.string().min(1, "Vui lòng nhập tên môn học"),
  subjectCode: z.string().min(1, "Vui lòng nhập mã môn học"),
  subjectDescription: z.string().optional(),
});

export const getSubjectErrorMessage = (values: { subjectName: string; subjectCode: string; subjectDescription?: string }) => {
  const result = subjectSchema.safeParse(values);

  if (result.success) {
    return {
      subjectNameError: null,
      subjectCodeError: null,
      subjectDescriptionError: null,
    };
  }

  const errors = result.error.format() as unknown as Record<string, { _errors: string[] }>;

  return {
    subjectNameError: errors.subjectName?._errors[0] || null,
    subjectCodeError: errors.subjectCode?._errors[0] || null,
    subjectDescriptionError: errors.subjectDescription?._errors[0] || null,
  };
}; 