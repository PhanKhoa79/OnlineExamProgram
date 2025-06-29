import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User, FileText, TrendingUp, Clock, Calendar } from 'lucide-react';
import { ExamResult } from '@/features/exam/types/exam.type';
import { getScoreBadgeVariant, getTypeBadge, formatDateTime } from '@/features/exam/utils/examResultsHelpers';

interface ExamResultDetailModalProps {
  result: ExamResult | null;
  isOpen: boolean;
  onClose: () => void;
}

const ExamResultDetailModal: React.FC<ExamResultDetailModalProps> = ({
  result,
  isOpen,
  onClose
}) => {
  if (!result) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Chi tiết kết quả thi
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Thông tin chi tiết về bài thi và kết quả của sinh viên
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Thông tin sinh viên */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Thông tin sinh viên
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-sm font-medium text-gray-700">Họ tên:</span>
                <p className="font-semibold text-gray-900">{result.studentName}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Mã sinh viên:</span>
                <p className="font-semibold text-blue-600">{result.studentId}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Lớp:</span>
                <p className="font-semibold text-gray-900">{result.class}</p>
              </div>
            </div>
          </div>

          {/* Thông tin đề thi */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-3 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Thông tin đề thi
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-700">Tên đề thi:</span>
                <p className="font-semibold text-gray-900">{result.examName}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-sm font-medium text-gray-700">Môn học:</span>
                  <p className="font-semibold text-gray-900">{result.subject}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Loại kỳ thi:</span>
                  {getTypeBadge(result.type)}
                </div>
              </div>
            </div>
          </div>

          {/* Kết quả thi */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-900 mb-3 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Kết quả thi
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="text-center p-3 bg-white rounded-lg border">
                <p className="text-sm text-gray-600 mb-1">Điểm số</p>
                <Badge variant={getScoreBadgeVariant(result.score)} className="text-2xl font-bold px-4 py-2">
                  {result.score}/{result.maxScore}
                </Badge>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border">
                <p className="text-sm text-gray-600 mb-1">Kết quả</p>
                <Badge 
                  variant={result.score >= 50 ? 'default' : 'destructive'} 
                  className={`text-lg font-semibold px-4 py-2 ${
                    result.score >= 50 
                      ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                  }`}
                >
                  {result.score >= 50 ? '✓ Đạt' : '✗ Không đạt'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Thời gian thi */}
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="font-semibold text-orange-900 mb-3 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Thời gian thi
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Bắt đầu:</span>
                </div>
                <p className="font-semibold text-gray-900 ml-6">{formatDateTime(result.startTime)}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Nộp bài:</span>
                </div>
                <p className="font-semibold text-gray-900 ml-6">{formatDateTime(result.submitTime)}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Thời gian cho phép:</span>
                </div>
                <p className="font-semibold text-blue-600 ml-6">{result.duration}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Thời gian thực tế:</span>
                </div>
                <p className="font-semibold text-green-600 ml-6">{result.actualDuration}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExamResultDetailModal; 