export interface StudentDto {
  id: number;
  studentCode: string;
  fullName: string;
  email: string | null;
}

export class StudentInfoDto {
  id: number | undefined;
  studentCode: string | undefined;
  fullName: string | undefined;
  email: string | null | undefined;
  address?: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  gender?: 'Nam' | 'Nữ' | 'Khác';
}
