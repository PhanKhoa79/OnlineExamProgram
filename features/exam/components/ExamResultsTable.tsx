import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { SearchIcon, Eye, RotateCcw, Loader2, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExamResult } from '@/features/exam/types/exam.type';
import { getScoreBadgeVariant, getTypeBadge, formatDateTime } from '@/features/exam/utils/examResultsHelpers';

type SortOrder = 'asc' | 'desc' | null;

interface ExamResultsTableProps {
  results: ExamResult[];
  loading: boolean;
  totalResults: number;
  hasActiveFilters: boolean;
  onViewDetail: (result: ExamResult) => void;
  onClearFilters: () => void;
  sortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
}

const ExamResultsTable: React.FC<ExamResultsTableProps> = ({
  results,
  loading,
  totalResults,
  hasActiveFilters,
  onViewDetail,
  onClearFilters,
  sortOrder,
  onSortChange
}) => {
  const handleSortClick = () => {
    if (sortOrder === null) {
      onSortChange('desc'); // First click: descending (highest first)
    } else if (sortOrder === 'desc') {
      onSortChange('asc'); // Second click: ascending (lowest first)
    } else {
      onSortChange(null); // Third click: no sorting
    }
  };

  const getSortIcon = () => {
    if (sortOrder === 'desc') {
      return <ChevronDown className="h-4 w-4 ml-1" />;
    } else if (sortOrder === 'asc') {
      return <ChevronUp className="h-4 w-4 ml-1" />;
    } else {
      return <ChevronsUpDown className="h-4 w-4 ml-1 opacity-50" />;
    }
  };

  return (
    <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-lg">
        <CardTitle className="text-xl">Danh sách kết quả thi</CardTitle>
        <CardDescription className="text-base">
          Hiển thị <span className="font-semibold text-blue-600">{results.length}</span> kết quả từ tổng số <span className="font-semibold">{totalResults}</span> bài thi
          {loading && (
            <Loader2 className="h-4 w-4 animate-spin inline-block ml-2" />
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="rounded-b-lg border-0 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-gray-50 to-slate-50 hover:from-gray-100 hover:to-slate-100">
                <TableHead className="font-bold text-gray-700 py-4">Sinh Viên</TableHead>
                <TableHead className="font-bold text-gray-700">Đề Thi</TableHead>
                <TableHead className="text-center font-bold text-gray-700">
                  <button
                    onClick={handleSortClick}
                    className="flex items-center justify-center w-full hover:bg-gray-100 rounded px-2 py-1 transition-colors cursor-pointer select-none"
                    title={
                      sortOrder === null 
                        ? 'Click để sắp xếp theo điểm' 
                        : sortOrder === 'desc' 
                        ? 'Đang sắp xếp giảm dần - Click để sắp xếp tăng dần'
                        : 'Đang sắp xếp tăng dần - Click để bỏ sắp xếp'
                    }
                  >
                    Điểm
                    {getSortIcon()}
                  </button>
                </TableHead>
                <TableHead className="text-center font-bold text-gray-700">Kết Quả</TableHead>
                <TableHead className="font-bold text-gray-700">Thời Gian</TableHead>
                <TableHead className="font-bold text-gray-700">Thời Gian Làm Bài</TableHead>
                <TableHead className="text-center font-bold text-gray-700">Hành Động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.length > 0 ? (
                results.map((result: ExamResult, index: number) => (
                  <TableRow 
                    key={result.studentExamId} 
                    className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}
                  >
                    <TableCell className="py-4">
                      <div className="space-y-1">
                        <div className="font-semibold text-gray-900">{result.studentName}</div>
                        <div className="text-sm text-blue-600 font-medium">{result.studentId}</div>
                        <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full inline-block">{result.class}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="font-medium text-gray-900 line-clamp-2">{result.examName}</div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-600 font-medium">{result.subject}</span>
                          {getTypeBadge(result.type)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="space-y-2">
                        <Badge variant={getScoreBadgeVariant(result.score)} className="text-lg font-bold px-3 py-1">
                          {result.score}/{result.maxScore}
                        </Badge>
                        <div className="text-xs text-gray-500">
                          Trên {result.maxScore} điểm
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant={result.score >= 50 ? 'default' : 'destructive'} 
                        className={`text-sm font-semibold ${
                          result.score >= 50 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {result.score >= 50 ? '✓ Đạt' : '✗ Không đạt'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500">Bắt đầu:</span>
                          <span className="font-medium">{formatDateTime(result.startTime)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500">Nộp bài:</span>
                          <span className="font-medium">{formatDateTime(result.submitTime)}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500">Cho phép:</span>
                          <span className="font-medium text-blue-600">{result.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500">Thực tế:</span>
                          <span className="font-medium text-green-600">{result.actualDuration}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer"
                        onClick={() => onViewDetail(result)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Xem chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <SearchIcon className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="space-y-2">
                        <div className="text-lg font-medium text-gray-900">Không tìm thấy kết quả nào</div>
                        <div className="text-sm text-gray-500 max-w-md">
                          Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm để xem kết quả phù hợp
                        </div>
                        {hasActiveFilters && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={onClearFilters}
                            className="mt-3"
                          >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Xóa tất cả bộ lọc
                          </Button>
                        )}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExamResultsTable; 