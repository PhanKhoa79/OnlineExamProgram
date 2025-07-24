/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { TopStudentItem, TopStudentsQuery } from '../types/report.type';
import { getTopStudents } from '../services/examServices';

interface UseTopStudentsReturn {
  students: TopStudentItem[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useTopStudents = (query: TopStudentsQuery): UseTopStudentsReturn => {
  const [students, setStudents] = useState<TopStudentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize query để tránh tạo object mới liên tục
  const stableQuery = useMemo(() => query, [
    query.classIds?.join(','),
    query.subjectIds?.join(','),
    query.limit,
    query.startDate,
    query.endDate,
    query
  ]);

  const fetchTopStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTopStudents(stableQuery);
      if (response.success) {
        setStudents(response.data);
      } else {
        setError('Failed to fetch top students data');
        setStudents([]);
      }
    } catch (err) {
      console.error('Error fetching top students:', err);
      setError('An error occurred while fetching top students data');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, [stableQuery]);

  useEffect(() => {
    fetchTopStudents();
  }, [fetchTopStudents]);

  const refetch = async () => {
    await fetchTopStudents();
  };

  return {
    students,
    loading,
    error,
    refetch
  };
}; 