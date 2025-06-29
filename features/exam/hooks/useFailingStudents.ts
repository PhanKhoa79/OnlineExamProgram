import { useState, useEffect, useCallback } from 'react';
import { getFailingStudents } from '../services/examServices';
import { 
  FailingStudentsQuery, 
  FailingStudentsResponse, 
  FailingStudentItem,
  FailureLevelEnum 
} from '../types/report.type';

interface UseFailingStudentsReturn {
  students: FailingStudentItem[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  summary: {
    totalFailingStudents: number;
    severeFailures: number;
    moderateFailures: number;
  };
  filters: FailingStudentsQuery;
  setFilters: (filters: Partial<FailingStudentsQuery>) => void;
  clearFilters: () => void;
  goToPage: (page: number) => void;
  refetch: () => Promise<void>;
}

const defaultFilters: FailingStudentsQuery = {
  failureLevel: FailureLevelEnum.ALL,
  limit: 20,
  page: 1,
};

export const useFailingStudents = (initialFilters?: Partial<FailingStudentsQuery>): UseFailingStudentsReturn => {
  const [students, setStudents] = useState<FailingStudentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
  });
  const [summary, setSummary] = useState({
    totalFailingStudents: 0,
    severeFailures: 0,
    moderateFailures: 0,
  });
  const [filters, setFiltersState] = useState<FailingStudentsQuery>({
    ...defaultFilters,
    ...initialFilters,
  });

  const fetchFailingStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response: FailingStudentsResponse = await getFailingStudents(filters);
      
      if (response.success) {
        setStudents(response.data);
        setPagination(response.pagination);
        setSummary(response.summary);
      } else {
        setError('Không thể tải dữ liệu học sinh không đạt');
      }
    } catch (err) {
      console.error('Error fetching failing students:', err);
      setError('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchFailingStudents();
  }, [fetchFailingStudents]);

  const setFilters = useCallback((newFilters: Partial<FailingStudentsQuery>) => {
    setFiltersState(prev => ({
      ...prev,
      ...newFilters,
      page: newFilters.page || 1, // Reset to page 1 when filters change (except when explicitly setting page)
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFiltersState(defaultFilters);
  }, []);

  const goToPage = useCallback((page: number) => {
    setFilters({ page });
  }, [setFilters]);

  const refetch = useCallback(async () => {
    await fetchFailingStudents();
  }, [fetchFailingStudents]);

  return {
    students,
    loading,
    error,
    pagination,
    summary,
    filters,
    setFilters,
    clearFilters,
    goToPage,
    refetch,
  };
}; 