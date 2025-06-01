import api from '@/lib/axios';
import { StudentDto, StudentInfoDto } from '@/features/student/types/student';

export const getListStudentWithoutAccount = async (): Promise<StudentDto[]> => {
  const response = await api.get<StudentDto[]>('/student/without-account');
  return response.data;
};

export const getStudentByEmail = async (email: string): Promise<StudentInfoDto> => {
  const response = await api.get<StudentDto>('/student/by-email', {
    params: { email },
  });
  return response.data;
};