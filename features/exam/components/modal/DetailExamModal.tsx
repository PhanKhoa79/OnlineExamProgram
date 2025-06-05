"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Edit, Delete } from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/hooks/use-toast";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { getExamById, getQuestionsOfExam, deleteExam, getAllExams } from "@/features/exam/services/examServices";
import { setExams } from "@/store/examSlice";
import { ExamDto } from "@/features/exam/types/exam.type";
import { SubjectResponseDto } from "@/features/subject/types/subject";
import { QuestionDto } from "@/features/question/types/question.type";
import { useAuthStore } from "@/features/auth/store";
import { hasPermission } from "@/lib/permissions";
import { Clock, BookOpen, Hash, PenTool, Eye, FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QuestionAnswersModal } from "@/components/ui/QuestionAnswersModal";
import { getDifficultyBgColor } from "@/lib/difficultyUtils";

interface DetailExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  examId: number | null;
}

export const DetailExamModal: React.FC<DetailExamModalProps> = ({
  isOpen,
  onClose,
  examId,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [exam, setExam] = useState<ExamDto | null>(null);
  const [questions, setQuestions] = useState<QuestionDto[]>([]);
  const [subject, setSubject] = useState<SubjectResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [selectedQuestionForModal, setSelectedQuestionForModal] = useState<QuestionDto | null>(null);
  const [isAnswersModalOpen, setIsAnswersModalOpen] = useState(false);

  const permissions = useAuthStore((state) => state.permissions);

  useEffect(() => {
    const fetchExamDetails = async () => {
      if (!examId || !isOpen) return;

      try {
        setIsLoading(true);
        const [examData, questionsData] = await Promise.all([
          getExamById(examId),
          getQuestionsOfExam(examId),
        ]);

        setExam(examData);
        setQuestions(questionsData);

        setSubject(examData.subject);
      } catch (error) {
        console.error("Failed to fetch exam details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExamDetails();
  }, [examId, isOpen]);

  const handleClose = () => {
    setExam(null);
    setQuestions([]);
    setSubject(null);
    onClose();
  };

  const handleViewAnswers = (question: QuestionDto) => {
    setSelectedQuestionForModal(question);
    setIsAnswersModalOpen(true);
  };

  if (!isOpen) return null;

  const getExamTypeColor = (type: string) => {
    return type === "official" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800";
  };

  const getExamTypeLabel = (type: string) => {
    return type === "official" ? "Chính thức" : "Luyện tập";
  };

  const getDifficultyStats = () => {
    const stats = questions.reduce((acc, question) => {
      const level = question.difficultyLevel || "chưa xác định";
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(stats).map(([level, count]) => ({
      level,
      count,
      percentage: ((count / questions.length) * 100).toFixed(1),
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Chi tiết đề thi</DialogTitle>
          <DialogDescription>
            Xem thông tin chi tiết và danh sách câu hỏi của đề thi
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : exam ? (
          <div className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {exam.name}
                </CardTitle>
                <CardDescription>Thông tin cơ bản của đề thi</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">ID đề thi:</span>
                    <span className="text-sm text-muted-foreground">
                      #{exam.id}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Thời gian:</span>
                    <span className="text-sm">{exam.duration} phút</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Số câu hỏi:</span>
                    <span className="text-sm">{exam.totalQuestions}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <PenTool className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Loại đề thi:</span>
                    <Badge className={getExamTypeColor(exam.examType)}>
                      {getExamTypeLabel(exam.examType)}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Môn học:</span>
                    <span className="text-sm">{subject ? `${subject.name} (${subject.code})` : "Chưa xác định"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            {questions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Thống kê câu hỏi</CardTitle>
                  <CardDescription>Phân bố độ khó của các câu hỏi trong đề thi</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {getDifficultyStats().map(({ level, count, percentage }) => {
                      const colors = {
                        'dễ': 'bg-green-100 text-green-800 border-green-200',
                        'trung bình': 'bg-yellow-100 text-yellow-800 border-yellow-200',
                        'khó': 'bg-red-100 text-red-800 border-red-200',
                        'chưa xác định': 'bg-gray-100 text-gray-800 border-gray-200'
                      };
                      const colorClass = colors[level as keyof typeof colors] || colors['chưa xác định'];

                      return (
                        <div key={level} className={`p-3 rounded-lg border ${colorClass}`}>
                          <div className="text-sm font-medium capitalize">{level}</div>
                          <div className="text-lg font-bold">{count} câu</div>
                          <div className="text-xs opacity-75">{percentage}%</div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            <Separator />

            {/* Questions List */}
            <Card>
              <CardHeader>
                <CardTitle>Danh sách câu hỏi ({questions.length})</CardTitle>
                <CardDescription>Các câu hỏi được chọn cho đề thi này</CardDescription>
              </CardHeader>
              <CardContent>
                {questions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Đề thi chưa có câu hỏi nào
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {questions.map((question, index) => (
                      <div key={question.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-medium text-gray-500">
                                Câu {index + 1}:
                              </span>
                              <Badge 
                                className={`${getDifficultyBgColor(question.difficultyLevel || "trung bình")} font-medium`}
                              >
                                {question.difficultyLevel || 'Chưa xác định'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-900 leading-relaxed">
                              {question.questionText}
                            </p>
                            <div className="flex gap-2 mt-2 items-center justify-between">
                              <div className="flex gap-2">
                                {question.answers && question.answers.length > 0 && (
                                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                                    {question.answers.length} đáp án
                                  </span>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => handleViewAnswers(question)}
                                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-medium transition-colors"
                                title="Xem đáp án"
                              >
                                <Eye className="w-3 h-3" />
                                Xem đáp án
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-between gap-4">
              {hasPermission(permissions, "exam:update") && (
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors duration-200"
                  onClick={() => {
                    handleClose();
                    setTimeout(() => {
                      router.push(`/dashboard/exam/edit/${examId}`);
                    }, 50);
                  }}
                >
                  <Edit fontSize="small" />
                  Chỉnh sửa
                </button>
              )}

              {hasPermission(permissions, "exam:delete") && (
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded transition-colors duration-200"
                  onClick={() => setShowConfirmDelete(true)}
                >
                  <Delete fontSize="small" />
                  Xóa
                </button>
              )}
            </div>

            <ConfirmDeleteModal
              title="Bạn có chắc chắn muốn xóa đề thi này?"
              open={showConfirmDelete}
              onOpenChange={setShowConfirmDelete}
              onConfirm={async () => {
                try {
                  if (examId) {
                    await deleteExam(examId);
                    const data = await getAllExams();
                    dispatch(setExams(data));
                    setShowConfirmDelete(false);
                    handleClose();
                    toast({ 
                      title: 'Xóa đề thi thành công!'
                    });
                    router.refresh();
                  }
                } catch (err: unknown) {
                  toast({
                    title: 'Lỗi khi xóa đề thi',
                    description: err instanceof Error 
                      ? err.message 
                      : (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Không thể xóa đề thi',
                    variant: 'error',
                  });
                }
              }}
            />
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Không tìm thấy thông tin đề thi</p>
          </div>
        )}
      </DialogContent>

      {/* Question Answers Modal */}
      <QuestionAnswersModal
        isOpen={isAnswersModalOpen}
        onClose={() => setIsAnswersModalOpen(false)}
        question={selectedQuestionForModal}
      />
    </Dialog>
  );
}; 