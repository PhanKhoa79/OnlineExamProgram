import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

// Import all services
import { getAllStudents } from '@/features/student/services/studentService';
import { getAllClasses } from '@/features/classes/services/classServices';
import { getAllSubjects } from '@/features/subject/services/subjectServices';
import { getAllRolesWithPermissions } from '@/features/role/services/roleServices';
import { getAllExams } from '@/features/exam/services/examServices';
import { getAllSchedules } from '@/features/schedule/services/scheduleServices';
import { getAllQuestions } from '@/features/question/services/questionService';

// Import types
import { StudentDto } from '@/features/student/types/student';
import { ClassResponseDto } from '@/features/classes/types/class.type';
import { SubjectResponseDto } from '@/features/subject/types/subject';
import { RoleWithPermissionsDto } from '@/features/role/types/role';
import { ExamDto } from '@/features/exam/types/exam.type';
import { ExamScheduleDto } from '@/features/schedule/types/schedule';
import { QuestionDto } from '@/features/question/types/question.type';

export const useAllData = () => {
  const queryClient = useQueryClient();

  // Students data - changes frequently
  const studentsQuery = useQuery<StudentDto[]>({
    queryKey: ['students'],
    queryFn: getAllStudents,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });

  // Classes data - changes less frequently
  const classesQuery = useQuery<ClassResponseDto[]>({
    queryKey: ['classes'],
    queryFn: getAllClasses,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  // Subjects data - rarely changes
  const subjectsQuery = useQuery<SubjectResponseDto[]>({
    queryKey: ['subjects'],
    queryFn: getAllSubjects,
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });

  // Roles data - rarely changes
  const rolesQuery = useQuery<RoleWithPermissionsDto[]>({
    queryKey: ['roles'],
    queryFn: getAllRolesWithPermissions,
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });

  // Exams data - changes moderately
  const examsQuery = useQuery<ExamDto[]>({
    queryKey: ['exams'],
    queryFn: getAllExams,
    staleTime: 8 * 60 * 1000, // 8 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
  });

  // Schedules data - changes frequently
  const schedulesQuery = useQuery<ExamScheduleDto[]>({
    queryKey: ['schedules'],
    queryFn: getAllSchedules,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Questions data - changes moderately
  const questionsQuery = useQuery<QuestionDto[]>({
    queryKey: ['questions'],
    queryFn: getAllQuestions,
    staleTime: 8 * 60 * 1000, // 8 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
  });

  // Combine loading states
  const isLoading = [
    studentsQuery.isLoading,
    classesQuery.isLoading,
    subjectsQuery.isLoading,
    rolesQuery.isLoading,
    examsQuery.isLoading,
    schedulesQuery.isLoading,
    questionsQuery.isLoading,
  ].some(Boolean);

  // Combine error states
  const hasError = [
    studentsQuery.error,
    classesQuery.error,
    subjectsQuery.error,
    rolesQuery.error,
    examsQuery.error,
    schedulesQuery.error,
    questionsQuery.error,
  ].some(Boolean);

  // Invalidation functions
  const invalidateStudents = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['students'] });
  }, [queryClient]);

  const invalidateClasses = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['classes'] });
  }, [queryClient]);

  const invalidateSubjects = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['subjects'] });
  }, [queryClient]);

  const invalidateRoles = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['roles'] });
  }, [queryClient]);

  const invalidateExams = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['exams'] });
  }, [queryClient]);

  const invalidateSchedules = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['schedules'] });
  }, [queryClient]);

  const invalidateQuestions = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['questions'] });
  }, [queryClient]);

  const invalidateAll = useCallback(() => {
    queryClient.invalidateQueries();
  }, [queryClient]);

  return {
    // Data
    students: studentsQuery.data || [],
    classes: classesQuery.data || [],
    subjects: subjectsQuery.data || [],
    roles: rolesQuery.data || [],
    exams: examsQuery.data || [],
    schedules: schedulesQuery.data || [],
    questions: questionsQuery.data || [],

    // Loading states
    isLoading,
    studentsLoading: studentsQuery.isLoading,
    classesLoading: classesQuery.isLoading,
    subjectsLoading: subjectsQuery.isLoading,
    rolesLoading: rolesQuery.isLoading,
    examsLoading: examsQuery.isLoading,
    schedulesLoading: schedulesQuery.isLoading,
    questionsLoading: questionsQuery.isLoading,

    // Error states
    hasError,
    studentsError: studentsQuery.error,
    classesError: classesQuery.error,
    subjectsError: subjectsQuery.error,
    rolesError: rolesQuery.error,
    examsError: examsQuery.error,
    schedulesError: schedulesQuery.error,
    questionsError: questionsQuery.error,

    // Invalidation functions
    invalidateStudents,
    invalidateClasses,
    invalidateSubjects,
    invalidateRoles,
    invalidateExams,
    invalidateSchedules,
    invalidateQuestions,
    invalidateAll,
  };
}; 