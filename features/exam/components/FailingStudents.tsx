import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { SearchIcon, Filter, X, RotateCcw, Calendar, Download, RefreshCw, Loader2, AlertTriangle, Mail, UserX, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClassResponseDto } from '@/features/classes/types/class.type';
import { SubjectResponseDto } from '@/features/subject/types/subject';
import { FailureLevelEnum, FailingStudentItem } from '@/features/exam/types/report.type';
import { useFailingStudents } from '@/features/exam/hooks/useFailingStudents';
import { getFailureLevelBadge, getFailureLevelColor, getTypeBadge } from '@/features/exam/utils/examResultsHelpers';
import { toast } from '@/components/hooks/use-toast';

interface FailingStudentsProps {
  selectedClassId?: number;
  selectedSubjectId?: number;
  classes: ClassResponseDto[];
  subjects: SubjectResponseDto[];
}

const FailingStudents: React.FC<FailingStudentsProps> = ({ selectedClassId, selectedSubjectId, classes, subjects }) => {
  // Use the failing students hook with real API data
  const {
    students: failingStudents,
    loading: loadingFailingStudents,
    error: failingStudentsError,
    pagination: failingPagination,
    summary: failingSummary,
    filters: failingFilters,
    setFilters: setFailingFilters,
    clearFilters: clearFailingFilters,
    goToPage: goToFailingPage,
    refetch: refetchFailingStudents
  } = useFailingStudents({
    classIds: selectedClassId ? [selectedClassId] : undefined,
    subjectIds: selectedSubjectId ? [selectedSubjectId] : undefined,
    failureLevel: FailureLevelEnum.ALL,
    limit: 20,
    page: 1
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilterType, setDateFilterType] = useState<'all' | 'specific' | 'range'>('all');

  // Handle search with debounce effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // For now, we'll handle search on frontend since API might not support text search
      // In a real implementation, you might want to add search to the backend API
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Filter students based on search term (frontend filtering)
  const filteredFailingStudents = failingStudents.filter(student => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return student.studentName.toLowerCase().includes(searchLower) ||
           student.studentId.toLowerCase().includes(searchLower) ||
           student.examName.toLowerCase().includes(searchLower);
  });

  const handleClassFilterChange = (classId: number | undefined) => {
    setFailingFilters({
      classIds: classId ? [classId] : undefined,
      page: 1
    });
  };

  const handleSubjectFilterChange = (subjectId: number | undefined) => {
    setFailingFilters({
      subjectIds: subjectId ? [subjectId] : undefined,
      page: 1
    });
  };

  const handleFailureLevelChange = (level: string) => {
    setFailingFilters({ failureLevel: level === 'all' ? undefined : level as FailureLevelEnum });
  };

  const handleDateFilterChange = (type: 'all' | 'specific' | 'range') => {
    setDateFilterType(type);
    if (type === 'all') {
      setFailingFilters({ specificDate: undefined, startDate: undefined, endDate: undefined });
    } else if (type === 'specific') {
      setFailingFilters({ startDate: undefined, endDate: undefined });
    } else if (type === 'range') {
      setFailingFilters({ specificDate: undefined });
    }
  };

  const hasActiveFailingFilters = 
    failingFilters.classIds?.length ||
    failingFilters.subjectIds?.length ||
    failingFilters.failureLevel !== FailureLevelEnum.ALL ||
    failingFilters.specificDate ||
    failingFilters.startDate ||
    failingFilters.endDate ||
    searchTerm;

  const handleClearAllFilters = () => {
    clearFailingFilters();
    setSearchTerm('');
    setDateFilterType('all');
  };

  const handleSendNotification = (student: FailingStudentItem) => {
    toast({
      title: 'Thông báo đã gửi',
      description: `Đã gửi thông báo đến ${student.studentName}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-red-500 bg-red-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Nghiêm trọng (&lt;30)</p>
                <p className="text-2xl font-bold text-red-700">
                  {loadingFailingStudents ? '...' : failingSummary.severeFailures}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 bg-orange-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Trung bình (30-49)</p>
                <p className="text-2xl font-bold text-orange-700">
                  {loadingFailingStudents ? '...' : failingSummary.moderateFailures}
                </p>
              </div>
              <UserX className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 bg-blue-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Tổng không đạt</p>
                <p className="text-2xl font-bold text-blue-700">
                  {loadingFailingStudents ? '...' : failingSummary.totalFailingStudents}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-red-100 rounded-lg">
                <Filter className="h-5 w-5 text-red-600" />
              </div>
              Bộ lọc học sinh không đạt
            </CardTitle>
            {hasActiveFailingFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAllFilters}
                className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Xóa bộ lọc
              </Button>
            )}
          </div>
          {hasActiveFailingFilters && (
            <div className="flex flex-wrap gap-2 mt-3">
              {failingFilters.classIds?.length && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Lớp: {classes.find(cls => cls.id === failingFilters.classIds?.[0])?.name || 'Đã chọn'}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer hover:text-blue-900" 
                    onClick={() => handleClassFilterChange(undefined)}
                  />
                </Badge>
              )}
              {failingFilters.subjectIds?.length && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Môn: {subjects.find(sub => sub.id === failingFilters.subjectIds?.[0])?.name || 'Đã chọn'}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer hover:text-green-900" 
                    onClick={() => handleSubjectFilterChange(undefined)}
                  />
                </Badge>
              )}
              {failingFilters.failureLevel && failingFilters.failureLevel !== FailureLevelEnum.ALL && (
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  Mức độ: {failingFilters.failureLevel === 'severe' ? 'Nghiêm trọng' : 'Trung bình'}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer hover:text-orange-900" 
                    onClick={() => handleFailureLevelChange('all')}
                  />
                </Badge>
              )}
              {failingFilters.specificDate && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  Ngày: {new Date(failingFilters.specificDate).toLocaleDateString('vi-VN')}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer hover:text-purple-900" 
                    onClick={() => handleDateFilterChange('all')}
                  />
                </Badge>
              )}
              {(failingFilters.startDate || failingFilters.endDate) && (
                <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                  Khoảng: {failingFilters.startDate ? new Date(failingFilters.startDate).toLocaleDateString('vi-VN') : '...'} - {failingFilters.endDate ? new Date(failingFilters.endDate).toLocaleDateString('vi-VN') : '...'}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer hover:text-indigo-900" 
                    onClick={() => handleDateFilterChange('all')}
                  />
                </Badge>
              )}
              {searchTerm && (
                <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                  Tìm kiếm: &quot;{searchTerm}&quot;
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer hover:text-gray-900" 
                    onClick={() => setSearchTerm('')}
                  />
                </Badge>
              )}
            </div>
          )}
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Filter row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2 relative">
                <label className="text-sm font-semibold text-gray-700">Lớp học</label>
                <Select 
                  value={failingFilters.classIds?.[0]?.toString() || 'all'} 
                  onValueChange={(value) => handleClassFilterChange(value === 'all' ? undefined : parseInt(value))}
                >
                  <SelectTrigger className="h-10 border-2 border-gray-200 focus:border-red-500 transition-colors w-full">
                    <SelectValue 
                      placeholder="Chọn lớp"
                      className="truncate text-left"
                    />
                  </SelectTrigger>
                  <SelectContent className="z-50 max-h-60 bg-white border border-gray-200 shadow-lg">
                    <SelectItem value="all">Tất cả lớp</SelectItem>
                    {classes.map(cls => (
                      <SelectItem key={cls.id} value={cls.id.toString()}>
                        <span className="truncate">{cls.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 relative">
                <label className="text-sm font-semibold text-gray-700">Môn học</label>
                <Select 
                  value={failingFilters.subjectIds?.[0]?.toString() || 'all'} 
                  onValueChange={(value) => handleSubjectFilterChange(value === 'all' ? undefined : parseInt(value))}
                >
                  <SelectTrigger className="h-10 border-2 border-gray-200 focus:border-red-500 transition-colors w-full">
                    <SelectValue 
                      placeholder="Chọn môn"
                      className="truncate text-left"
                    />
                  </SelectTrigger>
                  <SelectContent className="z-50 max-h-60 bg-white border border-gray-200 shadow-lg">
                    <SelectItem value="all">Tất cả môn</SelectItem>
                    {subjects.map(sub => (
                      <SelectItem key={sub.id} value={sub.id.toString()}>
                        <span className="truncate">{sub.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 relative">
                <label className="text-sm font-semibold text-gray-700">Mức độ</label>
                <Select value={failingFilters.failureLevel || 'all'} onValueChange={handleFailureLevelChange}>
                  <SelectTrigger className="h-10 border-2 border-gray-200 focus:border-red-500 transition-colors w-full">
                    <SelectValue 
                      placeholder="Chọn mức độ"
                      className="truncate text-left"
                    />
                  </SelectTrigger>
                  <SelectContent className="z-50 max-h-60 bg-white border border-gray-200 shadow-lg">
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="severe">🚨 Nghiêm trọng (&lt;30)</SelectItem>
                    <SelectItem value="moderate">⚠️ Trung bình (30-49)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date Filter Section */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  Lọc theo thời gian
                </label>
                <Select 
                  value={dateFilterType} 
                  onValueChange={(value: 'all' | 'specific' | 'range') => {
                    setDateFilterType(value);
                    if (value === 'all') {
                      setFailingFilters({ specificDate: undefined, startDate: undefined, endDate: undefined });
                    } else if (value === 'specific') {
                      setFailingFilters({ startDate: undefined, endDate: undefined });
                    } else if (value === 'range') {
                      setFailingFilters({ specificDate: undefined });
                    }
                  }}
                >
                  <SelectTrigger className="h-11 border-2 border-gray-200 focus:border-blue-500 transition-colors hover:border-blue-300 bg-white shadow-sm w-full">
                    <SelectValue 
                      placeholder="Chọn kiểu lọc thời gian"
                      className="truncate text-left"
                    />
                  </SelectTrigger>
                  <SelectContent className="z-50 max-h-60 bg-white border border-gray-200 shadow-lg">
                    <SelectItem value="all" className="font-medium">📅 Tất cả thời gian</SelectItem>
                    <SelectItem value="specific">📆 Ngày cụ thể</SelectItem>
                    <SelectItem value="range">📊 Khoảng thời gian</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Specific Date Input */}
              {dateFilterType === 'specific' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-orange-500" />
                    Chọn ngày cụ thể
                  </label>
                  <Input
                    type="date"
                    value={failingFilters.specificDate || ''}
                    onChange={(e) => setFailingFilters({ specificDate: e.target.value || undefined })}
                    className="h-11 border-2 border-gray-200 focus:border-orange-500 transition-colors hover:border-orange-300 bg-white shadow-sm"
                  />
                </div>
              )}

              {/* Date Range Inputs */}
              {dateFilterType === 'range' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-orange-500" />
                      Từ ngày
                    </label>
                    <Input
                      type="date"
                      value={failingFilters.startDate || ''}
                      onChange={(e) => setFailingFilters({ startDate: e.target.value || undefined })}
                      className="h-11 border-2 border-gray-200 focus:border-orange-500 transition-colors hover:border-orange-300 bg-white shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-orange-500" />
                      Đến ngày
                    </label>
                    <Input
                      type="date"
                      value={failingFilters.endDate || ''}
                      onChange={(e) => setFailingFilters({ endDate: e.target.value || undefined })}
                      className="h-11 border-2 border-gray-200 focus:border-orange-500 transition-colors hover:border-orange-300 bg-white shadow-sm"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Search Section */}
            <div className="space-y-2 pt-4 border-t border-gray-200">
              <label className="text-sm font-semibold text-gray-700">Tìm kiếm</label>
              <div className="relative max-w-md">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                <Input 
                  placeholder="Tìm học sinh..." 
                  className="pl-10 h-10 border-2 border-gray-200 focus:border-red-500 transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                {loadingFailingStudents ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang tải dữ liệu...
                  </div>
                ) : failingStudentsError ? (
                  <span className="text-red-600">Có lỗi xảy ra khi tải dữ liệu</span>
                ) : (
                  <>
                    Tìm thấy <span className="font-semibold text-red-600">{filteredFailingStudents.length}</span> học sinh không đạt
                    {failingPagination.totalItems > filteredFailingStudents.length && (
                      <span className="text-gray-500 ml-2">
                        (từ tổng số {failingPagination.totalItems} học sinh)
                      </span>
                    )}
                  </>
                )}
              </div>
              <div className="flex gap-2 sm:ml-auto">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={refetchFailingStudents}
                  className="flex items-center gap-2"
                  disabled={loadingFailingStudents}
                >
                  {loadingFailingStudents ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  Làm mới
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 rounded-t-lg">
          <CardTitle className="text-xl">Danh sách học sinh không đạt</CardTitle>
          <CardDescription className="text-base">
            Hiển thị {filteredFailingStudents.length} học sinh cần hỗ trợ
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loadingFailingStudents ? (
            <div className="p-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <div className="text-sm text-gray-500">Đang tải danh sách học sinh không đạt...</div>
            </div>
          ) : failingStudentsError ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="h-8 w-8 text-red-400" />
              </div>
              <div className="text-sm text-red-600 mb-2">Có lỗi xảy ra khi tải dữ liệu</div>
              <Button variant="outline" size="sm" onClick={refetchFailingStudents}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Thử lại
              </Button>
            </div>
          ) : filteredFailingStudents.length > 0 ? (
            <div className="space-y-2 p-4">
              {filteredFailingStudents.map((student, index) => (
                <div 
                  key={`${student.studentId}-${student.examName}-${index}`} 
                  className={`p-4 rounded-lg border-l-4 transition-all duration-300 hover:shadow-md ${getFailureLevelColor(student.failureLevel)}`}
                >
                  <div className="space-y-4">
                    {/* Student info */}
                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="font-semibold text-gray-900">{student.studentName}</div>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-xs">{student.studentId}</Badge>
                          <Badge variant="secondary" className="text-xs">{student.className}</Badge>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <div className="font-medium">{student.examName}</div>
                        <div className="text-gray-500">{student.subject} • {new Date(student.examDate).toLocaleDateString('vi-VN')}</div>
                      </div>
                    </div>

                    {/* Score, level and actions - mobile friendly */}
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="text-center">
                          <Badge variant="destructive" className="text-sm font-bold px-2 py-1">
                            {student.score}/{student.maxScore}
                          </Badge>
                          <div className="text-xs text-gray-500 mt-1">Điểm số</div>
                        </div>
                        
                        <div className="text-center">
                          {getFailureLevelBadge(student.failureLevel)}
                          <div className="text-xs text-gray-500 mt-1">Mức độ</div>
                        </div>
                        
                        <div>
                          {getTypeBadge(student.examType)}
                        </div>
                      </div>

                      {/* Actions - full width on mobile */}
                      <div className="flex justify-end">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSendNotification(student)}
                          className="flex items-center gap-2 hover:bg-blue-50 px-4 py-2 min-w-[120px]"
                        >
                          <Mail className="h-4 w-4" />
                          <span>Thông báo</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-400" />
              </div>
              <div className="text-lg font-medium text-gray-900">Không có học sinh không đạt</div>
              <div className="text-sm text-gray-500 mt-1">
                Tất cả học sinh đều đạt yêu cầu với bộ lọc hiện tại
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination for failing students */}
      {!loadingFailingStudents && !failingStudentsError && failingPagination.totalPages > 1 && (
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-700">
                  Hiển thị <span className="font-medium">{((failingPagination.currentPage - 1) * failingPagination.itemsPerPage) + 1}</span> đến{' '}
                  <span className="font-medium">{Math.min(failingPagination.currentPage * failingPagination.itemsPerPage, failingPagination.totalItems)}</span> của{' '}
                  <span className="font-medium">{failingPagination.totalItems}</span> học sinh
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToFailingPage(failingPagination.currentPage - 1)}
                  disabled={failingPagination.currentPage === 1 || loadingFailingStudents}
                  className="h-9 px-3"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Trước
                </Button>

                <div className="flex items-center gap-1">
                  {(() => {
                    const maxPages = 5;
                    const totalPages = failingPagination.totalPages;
                    const currentPage = failingPagination.currentPage;
                    
                    let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
                    const endPage = Math.min(totalPages, startPage + maxPages - 1);
                    
                    if (endPage - startPage + 1 < maxPages && totalPages >= maxPages) {
                      startPage = Math.max(1, endPage - maxPages + 1);
                    }
                    
                    const pages = [];
                    
                    if (startPage > 1) {
                      pages.push(
                        <Button
                          key={1}
                          variant="outline"
                          size="sm"
                          onClick={() => goToFailingPage(1)}
                          disabled={loadingFailingStudents}
                          className="h-9 w-9"
                        >
                          1
                        </Button>
                      );
                      
                      if (startPage > 2) {
                        pages.push(
                          <span key="start-ellipsis" className="px-2 text-gray-400">
                            ...
                          </span>
                        );
                      }
                    }
                    
                    for (let i = startPage; i <= endPage; i++) {
                      pages.push(
                        <Button
                          key={i}
                          variant={i === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => goToFailingPage(i)}
                          disabled={loadingFailingStudents}
                          className="h-9 w-9"
                        >
                          {i}
                        </Button>
                      );
                    }
                    
                    if (endPage < totalPages) {
                      if (endPage < totalPages - 1) {
                        pages.push(
                          <span key="end-ellipsis" className="px-2 text-gray-400">
                            ...
                          </span>
                        );
                      }
                      
                      pages.push(
                        <Button
                          key={totalPages}
                          variant="outline"
                          size="sm"
                          onClick={() => goToFailingPage(totalPages)}
                          disabled={loadingFailingStudents}
                          className="h-9 w-9"
                        >
                          {totalPages}
                        </Button>
                      );
                    }
                    
                    return pages;
                  })()}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToFailingPage(failingPagination.currentPage + 1)}
                  disabled={failingPagination.currentPage === failingPagination.totalPages || loadingFailingStudents}
                  className="h-9 px-3"
                >
                  Sau
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FailingStudents; 