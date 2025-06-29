'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { getAllClasses } from '@/features/classes/services/classServices';
import { getAllSubjects } from '@/features/subject/services/subjectServices';
import { ClassResponseDto } from '@/features/classes/types/class.type';
import { SubjectResponseDto } from '@/features/subject/types/subject';
import { toast } from '@/components/hooks/use-toast';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useExamResults } from '@/features/exam/hooks/useExamResults';
import { ExamResult } from '@/features/exam/types/exam.type';
import { Eye, AlertTriangle } from 'lucide-react';

// Import all the new components
import StatisticsCards from '@/features/exam/components/StatisticsCards';
import ExamResultsFilters from '@/features/exam/components/ExamResultsFilters';
import ExamResultsTable from '@/features/exam/components/ExamResultsTable';
import ExamResultsPagination from '@/features/exam/components/ExamResultsPagination';
import TopStudentsRanking from '@/features/exam/components/TopStudentsRanking';
import FailingStudents from '@/features/exam/components/FailingStudents';
import ExamResultDetailModal from '@/features/exam/components/ExamResultDetailModal';

const ExamResultsPage = () => {
  usePageTitle('Kết quả thi');
  const router = useRouter();
  const [selectedResult, setSelectedResult] = useState<ExamResult | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [classes, setClasses] = useState<ClassResponseDto[]>([]);
  const [subjects, setSubjects] = useState<SubjectResponseDto[]>([]);
  const [loadingMetadata, setLoadingMetadata] = useState(true);
  const [dateFilterType, setDateFilterType] = useState<'all' | 'specific' | 'range'>('all');
  
  const {
    results,
    loading,
    pagination,
    statistics,
    filters,
    setFilters,
    clearFilters,
    goToPage,
    refetch
  } = useExamResults();

  // Fetch classes and subjects for filters
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setLoadingMetadata(true);
        const [classesData, subjectsData] = await Promise.all([
          getAllClasses(),
          getAllSubjects()
        ]);
        setClasses(classesData);
        setSubjects(subjectsData);
      } catch (error) {
        console.error('Error fetching classes and subjects:', error);
      } finally {
        setLoadingMetadata(false);
      }
    };

    fetchMetadata();
  }, []);

  // Sync dateFilterType with actual filter values
  useEffect(() => {
    if (filters.specificDate !== undefined) {
      setDateFilterType('specific');
    } else if (filters.startDate !== undefined || filters.endDate !== undefined) {
      setDateFilterType('range');
    } else {
      setDateFilterType('all');
    }
  }, [filters.specificDate, filters.startDate, filters.endDate]);

  // Custom clear filters function that also resets dateFilterType
  const handleClearFilters = () => {
    clearFilters();
    setDateFilterType('all');
  };

  // Check if any filters are applied
  const hasActiveFilters = filters.searchTerm !== '' || filters.classId !== undefined || filters.subjectId !== undefined || filters.examType !== undefined || filters.specificDate !== undefined || filters.startDate !== undefined || filters.endDate !== undefined;

  const handleViewDetail = (result: ExamResult) => {
    setSelectedResult(result);
    setIsDetailModalOpen(true);
  };

  const handleRefresh = async () => {
    try {
      await refetch();
      toast({
        title: 'Thành công',
        description: 'Dữ liệu đã được làm mới!',
      });
    } catch {
      toast({
        title: 'Lỗi',
        description: 'Không thể làm mới dữ liệu. Vui lòng thử lại.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="flex flex-col gap-8 p-6 max-w-7xl mx-auto">
        {/* Header với gradient */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">Kết Quả Thi Của Sinh Viên</h1>
                <p className="text-blue-100 text-lg">Quản lý và theo dõi kết quả thi của sinh viên một cách hiệu quả</p>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => router.back()}
                  className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm cursor-pointer"
                >
                  Quay Lại
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <StatisticsCards statistics={statistics} />

        {/* Main Content with Tabs */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left side - 2/3 width - Tabbed Content */}
          <div className="xl:col-span-2 space-y-6">
            <Tabs defaultValue="results" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="results" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Kết quả thi
                </TabsTrigger>
                <TabsTrigger value="failing" className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Học sinh không đạt
                </TabsTrigger>
              </TabsList>

              <TabsContent value="results" className="space-y-6">
                {/* Filters */}
                <ExamResultsFilters
                  filters={filters}
                  setFilters={setFilters}
                  clearFilters={handleClearFilters}
                  classes={classes}
                  subjects={subjects}
                  loadingMetadata={loadingMetadata}
                  loading={loading}
                  totalResults={pagination.totalResults}
                  hasActiveFilters={hasActiveFilters}
                  onRefresh={handleRefresh}
                  dateFilterType={dateFilterType}
                  setDateFilterType={setDateFilterType}
                />

                {/* Results Table */}
                <ExamResultsTable
                  results={results}
                  loading={loading}
                  totalResults={pagination.totalResults}
                  hasActiveFilters={hasActiveFilters}
                  onViewDetail={handleViewDetail}
                  onClearFilters={handleClearFilters}
                />

                {/* Pagination */}
                <ExamResultsPagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  totalResults={pagination.totalResults}
                  limit={pagination.limit}
                  loading={loading}
                  onPageChange={goToPage}
                />
              </TabsContent>

              <TabsContent value="failing" className="space-y-6">
                <FailingStudents 
                  selectedClassId={filters.classId}
                  selectedSubjectId={filters.subjectId}
                  classes={classes}
                  subjects={subjects}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right side - 1/3 width - Top 10 Students Ranking */}
          <div className="xl:col-span-1">
            <TopStudentsRanking selectedClassId={filters.classId} classes={classes} />
          </div>
        </div>

        {/* Detail Modal */}
        <ExamResultDetailModal
          result={selectedResult}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default ExamResultsPage; 