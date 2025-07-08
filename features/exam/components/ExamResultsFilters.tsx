import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { SearchIcon, Filter, X, RotateCcw, Calendar, RefreshCw, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClassResponseDto } from '@/features/classes/types/class.type';
import { SubjectResponseDto } from '@/features/subject/types/subject';
import { ExamResultFilters as ExamResultFiltersType } from '@/features/exam/types/exam.type';

interface ExamResultsFiltersProps {
  filters: ExamResultFiltersType;
  setFilters: (filters: Partial<ExamResultFiltersType>) => void;
  clearFilters: () => void;
  classes: ClassResponseDto[];
  subjects: SubjectResponseDto[];
  loadingMetadata: boolean;
  loading: boolean;
  totalResults: number;
  hasActiveFilters: boolean;
  onRefresh: () => void;
  dateFilterType: 'all' | 'specific' | 'range';
  setDateFilterType: (type: 'all' | 'specific' | 'range') => void;
}

const ExamResultsFilters: React.FC<ExamResultsFiltersProps> = ({
  filters,
  setFilters,
  clearFilters,
  classes,
  subjects,
  loadingMetadata,
  loading,
  totalResults,
  hasActiveFilters,
  onRefresh,
  dateFilterType,
  setDateFilterType
}) => {
  const handleClearFilters = () => {
    clearFilters();
    setDateFilterType('all');
  };

  const handleDateFilterChange = (value: 'all' | 'specific' | 'range') => {
    setDateFilterType(value);
    if (value === 'all') {
      setFilters({ specificDate: undefined, startDate: undefined, endDate: undefined });
    } else if (value === 'specific') {
      setFilters({ startDate: undefined, endDate: undefined });
    } else if (value === 'range') {
      setFilters({ specificDate: undefined });
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-lg">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Filter className="h-5 w-5 text-blue-600" />
            </div>
            Bộ lọc và tìm kiếm
          </CardTitle>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Xóa bộ lọc
            </Button>
          )}
        </div>
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mt-3">
            {filters.searchTerm && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Tìm kiếm: &quot;{filters.searchTerm}&quot;
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer hover:text-blue-900" 
                  onClick={() => setFilters({ searchTerm: '' })}
                />
              </Badge>
            )}
            {filters.classId && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Lớp: {classes.find(cls => cls.id === filters.classId)?.name || 'Đã chọn'}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer hover:text-green-900" 
                  onClick={() => setFilters({ classId: undefined })}
                />
              </Badge>
            )}
            {filters.subjectId && (
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                Môn: {subjects.find(sub => sub.id === filters.subjectId)?.name || 'Đã chọn'}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer hover:text-purple-900" 
                  onClick={() => setFilters({ subjectId: undefined })}
                />
              </Badge>
            )}
            {filters.examType && (
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                Loại: {filters.examType === 'official' ? 'Chính thức' : 'Luyện tập'}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer hover:text-orange-900" 
                  onClick={() => setFilters({ examType: undefined })}
                />
              </Badge>
            )}
            {filters.specificDate && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                Ngày: {filters.specificDate}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer hover:text-yellow-900" 
                  onClick={() => setFilters({ specificDate: undefined })}
                />
              </Badge>
            )}
            {(filters.startDate || filters.endDate) && (
              <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                Khoảng: {filters.startDate || '...'} - {filters.endDate || '...'}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer hover:text-indigo-900" 
                  onClick={() => setFilters({ startDate: undefined, endDate: undefined })}
                />
              </Badge>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Filter row - responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2 relative">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Lớp học
              </label>
              <Select 
                value={filters.classId?.toString() || 'all'} 
                onValueChange={(value) => setFilters({ classId: value === 'all' ? undefined : parseInt(value) })}
                disabled={loadingMetadata}
              >
                <SelectTrigger className="h-11 border-2 border-gray-200 focus:border-blue-500 transition-colors hover:border-blue-300 bg-white shadow-sm w-full">
                  <SelectValue 
                    placeholder={loadingMetadata ? "Đang tải..." : "Chọn lớp"}
                    className="truncate text-left"
                  />
                </SelectTrigger>
                <SelectContent className="z-50 max-h-60 bg-white border border-gray-200 shadow-lg">
                  <SelectItem value="all" className="font-medium">Tất cả lớp</SelectItem>
                  {classes.map(cls => (
                    <SelectItem key={cls.id} value={cls.id.toString()}>
                      <span className="truncate">{cls.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 relative">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Môn học
              </label>
              <Select 
                value={filters.subjectId?.toString() || 'all'} 
                onValueChange={(value) => setFilters({ subjectId: value === 'all' ? undefined : parseInt(value) })}
                disabled={loadingMetadata}
              >
                <SelectTrigger className="h-11 border-2 border-gray-200 focus:border-blue-500 transition-colors hover:border-blue-300 bg-white shadow-sm w-full">
                  <SelectValue 
                    placeholder={loadingMetadata ? "Đang tải..." : "Chọn môn"}
                    className="truncate text-left"
                  />
                </SelectTrigger>
                <SelectContent className="z-50 max-h-60 bg-white border border-gray-200 shadow-lg">
                  <SelectItem value="all" className="font-medium">Tất cả môn</SelectItem>
                  {subjects.map(sub => (
                    <SelectItem key={sub.id} value={sub.id.toString()}>
                      <span className="truncate">{sub.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 relative">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Loại kỳ thi
              </label>
              <Select value={filters.examType || 'all'} onValueChange={(value) => setFilters({ examType: value === 'all' ? undefined : value as 'practice' | 'official' })}>
                <SelectTrigger className="h-11 border-2 border-gray-200 focus:border-blue-500 transition-colors hover:border-blue-300 bg-white shadow-sm w-full">
                  <SelectValue 
                    placeholder="Loại kỳ thi"
                    className="truncate text-left"
                  />
                </SelectTrigger>
                <SelectContent className="z-50 max-h-60 bg-white border border-gray-200 shadow-lg">
                  <SelectItem value="all" className="font-medium">Tất cả loại</SelectItem>
                  <SelectItem value="practice">🏃‍♂️ Luyện tập</SelectItem>
                  <SelectItem value="official">🎯 Chính thức</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date Filter Section */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                Lọc theo thời gian
              </label>
              <Select 
                value={dateFilterType} 
                onValueChange={handleDateFilterChange}
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
                  value={filters.specificDate || ''}
                  onChange={(e) => setFilters({ specificDate: e.target.value || undefined })}
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
                    value={filters.startDate || ''}
                    onChange={(e) => setFilters({ startDate: e.target.value || undefined })}
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
                    value={filters.endDate || ''}
                    onChange={(e) => setFilters({ endDate: e.target.value || undefined })}
                    className="h-11 border-2 border-gray-200 focus:border-orange-500 transition-colors hover:border-orange-300 bg-white shadow-sm"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Search row */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Tìm kiếm</label>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
              <Input 
                placeholder="Tìm học sinh..." 
                className="pl-10 h-10 border-2 border-gray-200 focus:border-red-500 transition-colors"
                value={filters.searchTerm}
                onChange={(e) => setFilters({ searchTerm: e.target.value })}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Tìm thấy <span className="font-semibold text-blue-600">{totalResults}</span> kết quả
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={onRefresh}
                disabled={loading}
                className="flex items-center gap-2 hover:bg-gray-50 border-gray-300"
              >
                {loading ? (
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
  );
};

export default ExamResultsFilters; 