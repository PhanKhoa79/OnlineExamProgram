import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  createStudent, 
  updateStudent, 
  deleteStudent, 
  importStudentsFromFile 
} from '@/features/student/services/studentService';
import { CreateStudentDto, UpdateStudentDto } from '@/features/student/types/student';
import { toast } from '@/components/hooks/use-toast';

export const useStudentMutations = () => {
  const queryClient = useQueryClient();

  // Create student mutation
  const createStudentMutation = useMutation({
    mutationFn: (data: CreateStudentDto) => createStudent(data),
    onSuccess: () => {
      // Invalidate and refetch students data
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({ title: 'Thêm sinh viên thành công!' });
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Lỗi khi thêm sinh viên!', 
        description: error.message,
        variant: 'error' 
      });
    },
  });

  // Update student mutation
  const updateStudentMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateStudentDto }) => 
      updateStudent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({ title: 'Cập nhật sinh viên thành công!' });
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Lỗi khi cập nhật sinh viên!', 
        description: error.message,
        variant: 'error' 
      });
    },
  });

  // Delete student mutation
  const deleteStudentMutation = useMutation({
    mutationFn: (id: number) => deleteStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({ title: 'Xóa sinh viên thành công!' });
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Lỗi khi xóa sinh viên!', 
        description: error.message,
        variant: 'error' 
      });
    },
  });

  // Import students mutation
  const importStudentsMutation = useMutation({
    mutationFn: ({ file, type }: { file: File; type: 'xlsx' | 'csv' }) => 
      importStudentsFromFile(file, type),
    onSuccess: (response) => {
      const successStudents = response.data.createdStudents;
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      toast({ 
        title: `Import thành công ${successStudents.length} sinh viên!` 
      });
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Lỗi khi import sinh viên!', 
        description: error.message,
        variant: 'error' 
      });
    },
  });

  return {
    createStudent: createStudentMutation,
    updateStudent: updateStudentMutation,
    deleteStudent: deleteStudentMutation,
    importStudents: importStudentsMutation,
    
    // Loading states
    isCreating: createStudentMutation.isPending,
    isUpdating: updateStudentMutation.isPending,
    isDeleting: deleteStudentMutation.isPending,
    isImporting: importStudentsMutation.isPending,
  };
}; 