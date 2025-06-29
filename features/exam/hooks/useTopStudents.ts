import { useState, useEffect } from 'react';
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

  const fetchTopStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTopStudents(query);
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
  };

  useEffect(() => {
    fetchTopStudents();
  }, [JSON.stringify(query)]);

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