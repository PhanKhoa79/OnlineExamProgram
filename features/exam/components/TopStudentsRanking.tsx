import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, RefreshCw, X, Loader2 } from 'lucide-react';
import { ClassResponseDto } from '@/features/classes/types/class.type';
import { useTopStudents } from '@/features/exam/hooks/useTopStudents';
import { getRankBadge, getRankColor, getScoreColor } from '@/features/exam/utils/examResultsHelpers';

interface TopStudentsRankingProps {
  selectedClassId?: number;
  classes: ClassResponseDto[];
}

const TopStudentsRanking: React.FC<TopStudentsRankingProps> = ({ selectedClassId, classes }) => {
  const [rankingClassFilter, setRankingClassFilter] = useState<number | undefined>(selectedClassId);
  
  // Memoize query để tránh tạo object mới mỗi lần render
  const topStudentsQuery = useMemo(() => ({
    classIds: rankingClassFilter ? [rankingClassFilter] : undefined,
    limit: 10
  }), [rankingClassFilter]);
  
  // Fetch top students data using the custom hook
  const { students: topStudents, loading: loadingTopStudents, error: topStudentsError, refetch: refetchTopStudents } = useTopStudents(topStudentsQuery);

  return (
    <Card className="relative shadow-xl border-0 bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm top-6">
      <CardHeader className="absolute top-0 left-0 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 mt-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">🏆 Bảng Xếp Hạng</CardTitle>
              <CardDescription className="text-blue-100 text-sm">
                Top 10 sinh viên xuất sắc nhất
              </CardDescription>
            </div>
          </div>
        </div>
        
        {/* Class filter for ranking - Improved styling */}
        <div className="mt-4 relative">
          <Select 
            value={rankingClassFilter?.toString() || 'all'} 
            onValueChange={(value) => setRankingClassFilter(value === 'all' ? undefined : parseInt(value))}
          >
            <SelectTrigger className="bg-white/20 border-white/40 text-white placeholder:text-blue-100 h-10 hover:bg-white/30 transition-colors focus:bg-white/30 focus:border-white/60 [&>svg]:text-white [&>svg]:opacity-100 w-full">
              <SelectValue 
                placeholder="Chọn lớp để xem xếp hạng"
                className="truncate text-left"
              />
            </SelectTrigger>
            <SelectContent className="z-50 bg-white border-gray-200 shadow-xl max-h-60">
              <SelectItem value="all" className="hover:bg-blue-50 focus:bg-blue-50">Tất cả lớp</SelectItem>
              {classes.map(cls => (
                <SelectItem key={cls.id} value={cls.id.toString()} className="hover:bg-blue-50 focus:bg-blue-50">
                  <span className="truncate">{cls.name}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className="absolute top-32 left-0 w-full p-0">
        <div className="max-h-[600px] overflow-y-auto">
          {loadingTopStudents ? (
            <div className="p-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <div className="text-sm text-gray-500">Đang tải dữ liệu xếp hạng...</div>
            </div>
          ) : topStudentsError ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="h-8 w-8 text-red-400" />
              </div>
              <div className="text-sm text-red-600 mb-2">Có lỗi xảy ra khi tải dữ liệu</div>
              <Button variant="outline" size="sm" onClick={refetchTopStudents}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Thử lại
              </Button>
            </div>
          ) : topStudents.length > 0 ? (
            <div className="space-y-1 p-4">
              {topStudents.map((student) => (
                <div 
                  key={student.studentId} 
                  className={`relative p-4 rounded-lg border transition-all duration-300 hover:shadow-md hover:scale-[1.02] ${
                    student.rank <= 3 
                      ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 shadow-sm' 
                      : 'bg-white border-gray-200 hover:bg-blue-50/50'
                  }`}
                >
                  {/* Rank badge */}
                  <div className={`absolute -top-2 -left-2 w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold ${getRankColor(student.rank)}`}>
                    {student.rank <= 3 ? getRankBadge(student.rank) : student.rank}
                  </div>
                  
                  <div className="space-y-3 ml-4">
                    {/* Student info */}
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{student.studentName}</div>
                      <div className="text-xs text-blue-600 font-medium">{student.studentId}</div>
                      <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full inline-block mt-1">
                        {student.className}
                      </div>
                    </div>
                    
                    {/* Score and stats */}
                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <div className={`text-lg font-bold ${getScoreColor(student.averageScore)}`}>
                          {student.averageScore.toFixed(1)}
                        </div>
                        <div className="text-xs text-gray-500">Điểm TB</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium text-purple-600">
                          {student.examCount}
                        </div>
                        <div className="text-xs text-gray-500">Bài thi</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-green-600 font-medium">
                          ✓ Xuất sắc
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          student.averageScore >= 90 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                          student.averageScore >= 80 ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                          student.averageScore >= 70 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                          'bg-gradient-to-r from-red-400 to-red-600'
                        }`}
                        style={{ width: `${student.averageScore}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <div className="text-sm text-gray-500">
                Không có dữ liệu xếp hạng cho lớp này
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-b-lg border-t">
          <div className="text-center text-xs text-gray-600">
            📊 Dựa trên điểm trung bình các đề thi chính thức
          </div>
          <div className="text-center text-xs text-gray-500 mt-1">
            Cập nhật: {new Date().toLocaleDateString('vi-VN')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopStudentsRanking; 