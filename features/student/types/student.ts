export interface StudentDto {
  id: number;
  studentCode: string;
  fullName: string;
  email: string | null;
  address?: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  classId?: number;
  gender?: 'Nam' | 'Nữ' | 'Khác';
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudentDto {
  studentCode: string;
  fullName: string;
  gender: 'Nam' | 'Nữ' | 'Khác';
  dateOfBirth: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  classId: number;
}

export interface UpdateStudentDto {
  studentCode?: string;
  fullName?: string;
  gender?: 'Nam' | 'Nữ' | 'Khác';
  dateOfBirth?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  classId?: number;
  accountId?: number;
}

export interface CreateBulkStudentDto {
  students: CreateStudentDto[];
}

export interface BulkCreateResult {
  message: string;
  data: {
    success: number;
    failed: number;
    errors: Array<{
      index: number;
      studentCode?: string;
      error: string;
    }>;
    createdStudents: Array<{
      id: number;
      studentCode: string;
      fullName: string;
      email: string | null;
      address: string;
      dateOfBirth: string;
      phoneNumber: string;
      classId: number;
      gender: 'Nam' | 'Nữ' | 'Khác';
    }>;
  };
}