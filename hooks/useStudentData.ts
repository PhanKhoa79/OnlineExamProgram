import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { getAllStudents } from '@/features/student/services/studentService';
import { getAllClasses } from '@/features/classes/services/classServices';
import { StudentDto } from '@/features/student/types/student';
import { ClassResponseDto } from '@/features/classes/types/class.type';

export const useStudentData = () => {
  const queryClient = useQueryClient();

  // Cache students data for 5 minutes
  const {
    data: students = [],
    isLoading: studentsLoading,
    error: studentsError,
  } = useQuery<StudentDto[]>({
    queryKey: ['students'],
    queryFn: getAllStudents,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Cache classes data for 10 minutes (changes less frequently)
  const {
    data: classes = [],
    isLoading: classesLoading,
    error: classesError,
  } = useQuery<ClassResponseDto[]>({
    queryKey: ['classes'],
    queryFn: getAllClasses,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
  });

  const isLoading = studentsLoading || classesLoading;
  const hasError = studentsError || classesError;

  const invalidateStudents = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['students'] });
  }, [queryClient]);

  const invalidateClasses = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['classes'] });
  }, [queryClient]);

  return {
    students,
    classes,
    isLoading,
    hasError,
    invalidateStudents,
    invalidateClasses,
  };
}; 