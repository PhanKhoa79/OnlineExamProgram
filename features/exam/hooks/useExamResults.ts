import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ExamResult, ExamResultFilters } from '../types/exam.type';
import { getStudentExamResults } from '../services/examServices';
import { toast } from '@/components/hooks/use-toast';

interface UseExamResultsReturn {
  results: ExamResult[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalResults: number;
    limit: number;
  };
  statistics: {
    totalExams: number;
    averageScore: string;
    passedExams: number;
    passRate: string;
  };
  filters: ExamResultFilters & { searchTerm: string };
  setFilters: (filters: Partial<ExamResultFilters & { searchTerm: string }>) => void;
  clearFilters: () => void;
  goToPage: (page: number) => void;
  refetch: () => void;
}

export const useExamResults = (): UseExamResultsReturn => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [allResults, setAllResults] = useState<ExamResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<ExamResult[]>([]);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState({
    totalExams: 0,
    averageScore: '0',
    passedExams: 0,
    passRate: '0'
  });
  const [pagination, setPagination] = useState({
    currentPage: parseInt(searchParams.get('page') || '1'),
    totalPages: 1,
    totalResults: 0,
    limit: 10
  });
  const [filters, setFiltersState] = useState<ExamResultFilters & { searchTerm: string }>({
    searchTerm: '',
    classId: undefined,
    subjectId: undefined,
    examType: undefined,
    specificDate: undefined,
    startDate: undefined,
    endDate: undefined
  });

  const fetchResults = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Send filters to backend for server-side filtering (especially for date filters)
      const apiFilters: ExamResultFilters = {};
      if (filters.classId) apiFilters.classId = filters.classId;
      if (filters.subjectId) apiFilters.subjectId = filters.subjectId;
      if (filters.examType) apiFilters.examType = filters.examType;
      if (filters.specificDate) apiFilters.specificDate = filters.specificDate;
      if (filters.startDate) apiFilters.startDate = filters.startDate;
      if (filters.endDate) apiFilters.endDate = filters.endDate;

      const response = await getStudentExamResults(
        Object.keys(apiFilters).length > 0 ? apiFilters : undefined,
        1,
      );

      setAllResults(response.results);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải dữ liệu';
      setError(errorMessage);
      toast({
        title: 'Lỗi',
        description: errorMessage,
        variant: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, [filters.classId, filters.subjectId, filters.examType, filters.specificDate, filters.startDate, filters.endDate]); // Add date filters as dependencies

  const setFilters = useCallback((newFilters: Partial<ExamResultFilters & { searchTerm: string }>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page when filters change
  }, []);

  const clearFilters = useCallback(() => {
    setFiltersState({
      searchTerm: '',
      classId: undefined,
      subjectId: undefined,
      examType: undefined,
      specificDate: undefined,
      startDate: undefined,
      endDate: undefined
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  const goToPage = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
    
    // Update URL with page parameter
    const url = new URL(window.location.href);
    if (page === 1) {
      url.searchParams.delete('page');
    } else {
      url.searchParams.set('page', page.toString());
    }
    router.push(url.pathname + url.search);
  }, [router]);

  const refetch = useCallback(() => {
    fetchResults();
  }, [fetchResults]);

  // Apply all filters (search, class, subject, examType) whenever allResults or any filter changes
  useEffect(() => {
    let filtered = allResults;
    
    // Apply search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(result =>
        result.studentName.toLowerCase().includes(searchLower) ||
        result.studentId.toLowerCase().includes(searchLower) ||
        result.examName.toLowerCase().includes(searchLower) ||
        result.class.toLowerCase().includes(searchLower) ||
        result.subject.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters.classId) {
      filtered = filtered.filter(result => result.classId === filters.classId);
    }
    
    if (filters.subjectId) {
      filtered = filtered.filter(result => result.subjectId === filters.subjectId);
    }
    
    if (filters.examType) {
      filtered = filtered.filter(result => result.type === filters.examType);
    }
    
    // Note: Date filtering is now handled on the server-side, so we don't need client-side date filtering
    
    setFilteredResults(filtered);
    
    // Calculate statistics from filtered results
    const totalExams = filtered.length;
    const averageScore = totalExams > 0 
      ? (filtered.reduce((sum, result) => sum + result.score, 0) / totalExams).toFixed(1)
      : '0';
    const passedExams = filtered.filter(result => result.score >= 50).length;
    const passRate = totalExams > 0 ? ((passedExams / totalExams) * 100).toFixed(1) : '0';
    
    setStatistics({
      totalExams,
      averageScore,
      passedExams,
      passRate
    });
    
    // Reset to first page when filter changes
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, [allResults, filters.searchTerm, filters.classId, filters.subjectId, filters.examType]);

  // Apply pagination whenever filteredResults or currentPage changes  
  useEffect(() => {
    const totalResults = filteredResults.length;
    const totalPages = Math.ceil(totalResults / pagination.limit);
    const startIndex = (pagination.currentPage - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    const paginatedResults = filteredResults.slice(startIndex, endIndex);
    
    setResults(paginatedResults);
    setPagination(prev => ({
      ...prev,
      totalResults,
      totalPages
    }));
  }, [filteredResults, pagination.currentPage, pagination.limit]);

  // Fetch data when API filters change
  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  return {
    results,
    loading,
    error,
    pagination,
    statistics,
    filters,
    setFilters,
    clearFilters,
    goToPage,
    refetch
  };
}; 