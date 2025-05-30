import api from '@/lib/axios';
import { StudentDto } from '@/features/student/types/student';

export const getListStudentWithoutAccount = async (): Promise<StudentDto[]> => {
  const response = await api.get<StudentDto[]>('/student/without-account');
  return response.data;
};