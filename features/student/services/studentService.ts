import api from '@/lib/axios';
import { BulkCreateResult, CreateBulkStudentDto, CreateStudentDto, StudentDto, UpdateStudentDto } from '@/features/student/types/student';

export const getListStudentWithoutAccount = async (): Promise<StudentDto[]> => {
  const response = await api.get<StudentDto[]>('/student/without-account');
  return response.data;
};

export const getStudentByEmail = async (email: string): Promise<StudentDto> => {
  const response = await api.get<StudentDto>('/student/by-email', {
    params: { email },
  });
  return response.data;
};

export const getAllStudents = async (): Promise<StudentDto[]> => {
  const response = await api.get<StudentDto[]>('/student');
  return response.data;
};

// Lấy sinh viên theo ID
export const getStudentById = async (id: number): Promise<StudentDto> => {
  const response = await api.get<StudentDto>(`/student/${id}`);
  return response.data;
};

// Lấy sinh viên theo classId
export const getStudentsByClassId = async (classId: number): Promise<StudentDto[]> => {
  const response = await api.get<StudentDto[]>(`/student/class/${classId}`);
  return response.data;
};

// Tạo mới sinh viên
export const createStudent = async (data: CreateStudentDto): Promise<StudentDto> => {
  const response = await api.post<StudentDto>('/student', data);
  return response.data;
};

// Cập nhật sinh viên
export const updateStudent = async (id: number, data: UpdateStudentDto): Promise<StudentDto> => {
  const response = await api.put<StudentDto>(`/student/${id}`, data);
  return response.data;
};

// Xoá sinh viên
export const deleteStudent = async (id: number): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(`/student/${id}`);
  return response.data;
};

export const createBulkStudents = async (
  payload: CreateBulkStudentDto
): Promise<BulkCreateResult> => {
  const response = await api.post<BulkCreateResult>('/student/bulk', payload);
  return response.data;
};

export const exportStudents = async (students: StudentDto[], format: 'excel' | 'csv') => {
  const response = await api.post(
    `/student/export?format=${format}`,
    { students },
    {
      responseType: "blob",
    }
  );

  const blob = new Blob([response.data], {
    type:
      format === "excel"
        ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        : "text/csv",
  });

  const options = {
    suggestedName: `students.${format === 'excel' ? 'xlsx' : 'csv'}`,
    types: [
      {
        description: format === 'excel' ? 'Excel Files' : 'CSV Files',
        accept: {
          [format === 'excel'
            ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            : 'text/csv']: [format === 'excel' ? '.xlsx' : '.csv'],
        },
      },
    ],
  };

  if ('showSaveFilePicker' in window) {
    const handle = await (window as unknown as { 
      showSaveFilePicker: (options: {
        suggestedName: string;
        types: Array<{
          description: string;
          accept: Record<string, string[]>;
        }>;
      }) => Promise<{
        createWritable: () => Promise<{
          write: (data: Blob) => Promise<void>;
          close: () => Promise<void>;
        }>;
      }>;
    }).showSaveFilePicker(options);
    const writable = await handle.createWritable();
    await writable.write(blob);
    await writable.close();
  }
};

export const importStudentsFromFile = async (file: File, type: 'xlsx' | 'csv') : Promise<BulkCreateResult> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  const response = await api.post(`/student/import`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};

export const downloadTemplateFile = async (type: 'xlsx' | 'csv') => {
  try {  
    const response = await api.get(`/student/download-template?type=${type}`, {
      responseType: 'blob', 
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));

    const link = document.createElement('a');
    link.href = url;

    const fileName = `student_template.${type}`;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Chi tiết lỗi khi tải file mẫu:', error);
    throw error;
  }
};