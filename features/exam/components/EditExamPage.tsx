"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/hooks/use-toast";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getExamById, updateExam, getQuestionsOfExam } from "@/features/exam/services/examServices";
import { getAllSubjects } from "@/features/subject/services/subjectServices";
import { getAllQuestions } from "@/features/question/services/questionService";
import { UpdateExamDto, ExamDto } from "@/features/exam/types/exam.type";
import { SubjectResponseDto } from "@/features/subject/types/subject";
import { QuestionDto } from "@/features/question/types/question.type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Clock, BookOpen, Hash, PenTool, FileText, Eye } from "lucide-react";
import { formatDateTime } from "@/lib/dateUtils";
import { randomSelect } from "@/lib/arrayUtils";
import { QuestionAnswersModal } from "@/components/ui/QuestionAnswersModal";
import { getDifficultyBgColor } from "@/lib/difficultyUtils";


interface EditExamFormData {
  name: string;
  duration: number;
  examType: "practice" | "official";
  totalQuestions: number;
  subjectId: number;
}

const EditExamPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const examId = parseInt(params?.id as string);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [subjects, setSubjects] = useState<SubjectResponseDto[]>([]);
  const [questions, setQuestions] = useState<QuestionDto[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<QuestionDto[]>([]);
  const [examData, setExamData] = useState<ExamDto | null>(null);
  const [selectedQuestionForModal, setSelectedQuestionForModal] = useState<QuestionDto | null>(null);
  const [isAnswersModalOpen, setIsAnswersModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<EditExamFormData>();

  const selectedSubjectId = watch("subjectId");
  const totalQuestions = watch("totalQuestions");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsDataLoading(true);
        const [examResult, subjectsData, questionsData] = await Promise.all([
          getExamById(examId),
          getAllSubjects(),
          getAllQuestions(),
        ]);

        setExamData(examResult);
        setSubjects(subjectsData);
        setQuestions(questionsData);

        reset({
          name: examResult.name,
          duration: examResult.duration,
          examType: examResult.examType,
          totalQuestions: examResult.totalQuestions,
          subjectId: examResult.subject.id,
        });

        // Get exam questions
        const examQuestions = await getQuestionsOfExam(examId);
        setSelectedQuestions(examQuestions.map((q: QuestionDto) => q.id));

      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast({
          title: "Lỗi khi tải dữ liệu",
          variant: "error",
        });
      } finally {
        setIsDataLoading(false);
      }
    };

    if (examId) {
      fetchData();
    }
  }, [examId, reset]);

  // Filter questions by selected subject
  useEffect(() => {
    if (selectedSubjectId) {
      const filtered = questions.filter(
        (q) => q.subjectId === selectedSubjectId
      );
      setFilteredQuestions(filtered);
    } else {
      setFilteredQuestions([]);
    }
  }, [selectedSubjectId, questions]);

  const onSubmit = async (data: EditExamFormData, exitAfterSave = false) => {
    try {
      setIsLoading(true);

      if (selectedQuestions.length !== data.totalQuestions && selectedQuestions.length > 0) {
        toast({
          title: "Số câu hỏi không khớp",
          description: `Bạn đã chọn ${selectedQuestions.length} câu hỏi nhưng đặt tổng số là ${data.totalQuestions}. Đề thi vẫn sẽ được cập nhật.`,
          variant: "warning",
        });
      }

      const updateData: UpdateExamDto = {
        name: data.name,
        duration: data.duration,
        examType: data.examType,
        totalQuestions: data.totalQuestions,
        subjectId: data.subjectId,
        questionIds: selectedQuestions.length > 0 ? selectedQuestions : undefined,
      };

      await updateExam(examId, updateData);

      const updatedExamData = await getExamById(examId);
      setExamData(updatedExamData);

      toast({
        title: "Cập nhật đề thi thành công!",
        description: selectedQuestions.length > 0 
          ? `Đã cập nhật với ${selectedQuestions.length} câu hỏi` 
          : "Đề thi được cập nhật, chưa có câu hỏi",
      });

      if (exitAfterSave) {
        router.push("/dashboard/exam");
      }
    } catch (error) {
      console.error("Error updating exam:", error);
      toast({
        title: "Lỗi khi cập nhật đề thi",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = (exitAfterSave = false) => {
    handleSubmit((data) => onSubmit(data, exitAfterSave))();
  };

  const handleQuestionSelect = (questionId: number, checked: boolean) => {
    if (checked) {
      if (selectedQuestions.length < totalQuestions) {
        setSelectedQuestions([...selectedQuestions, questionId]);
      } else {
        toast({
          title: `Chỉ được chọn tối đa ${totalQuestions} câu hỏi`,
          variant: "error",
        });
      }
    } else {
      setSelectedQuestions(selectedQuestions.filter((id) => id !== questionId));
    }
  };

  const handleSelectAll = () => {
    if (filteredQuestions.length <= totalQuestions) {
      setSelectedQuestions(filteredQuestions.map((q) => q.id));
    } else {
      // Chọn ngẫu nhiên câu hỏi bằng Fisher-Yates algorithm
      const randomQuestions = randomSelect(filteredQuestions, totalQuestions);
      setSelectedQuestions(randomQuestions.map((q) => q.id));
    }
  };

  const handleClearAll = () => {
    setSelectedQuestions([]);
  };

  const handleViewAnswers = (question: QuestionDto) => {
    setSelectedQuestionForModal(question);
    setIsAnswersModalOpen(true);
  };

  if (isDataLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (!examData) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Không tìm thấy đề thi</h1>
          <Button 
            onClick={() => router.push("/dashboard/exam")}
            className="mt-4"
          >
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb className="flex list-none items-center gap-2">
        <BreadcrumbItem>
          <BreadcrumbLink
            href="/dashboard"
            className="text-blue-600 underline font-semibold"
          >
            Dashboard
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink
            href="/dashboard/exam"
            className="text-blue-600 underline font-semibold"
          >
            Đề thi
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>Chỉnh sửa đề thi</BreadcrumbItem>
      </Breadcrumb>

      <div className="text-center space-y-3 py-6">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full shadow-lg">
          <PenTool className="h-6 w-6" />
          <h1 className="text-2xl font-bold tracking-tight">Chỉnh sửa đề thi</h1>
        </div>
        <p className="text-lg text-gray-600 font-medium">
          Cập nhật thông tin đề thi: <span className="text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-full">&quot;{examData.name}&quot;</span>
        </p>
      </div>

      <form onSubmit={handleSubmit((data) => onSubmit(data, false))} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
              <CardDescription>
                Cập nhật thông tin cơ bản của đề thi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên đề thi *</Label>
                <Input
                  id="name"
                  placeholder="Nhập tên đề thi..."
                  {...register("name", {
                    required: "Tên đề thi là bắt buộc",
                    minLength: {
                      value: 5,
                      message: "Tên đề thi phải có ít nhất 5 ký tự",
                    },
                  })}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Thời gian (phút) *</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  max="300"
                  placeholder="60"
                  {...register("duration", {
                    required: "Thời gian làm bài là bắt buộc",
                    min: { value: 1, message: "Thời gian tối thiểu là 1 phút" },
                    max: { value: 300, message: "Thời gian tối đa là 300 phút" },
                    valueAsNumber: true,
                  })}
                />
                {errors.duration && (
                  <p className="text-sm text-red-500">{errors.duration.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="examType">Loại đề thi *</Label>
                <Select 
                  value={watch("examType")} 
                  onValueChange={(value) => setValue("examType", value as "practice" | "official")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại đề thi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="practice">Luyện tập</SelectItem>
                    <SelectItem value="official">Chính thức</SelectItem>
                  </SelectContent>
                </Select>
                {errors.examType && (
                  <p className="text-sm text-red-500">{errors.examType.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="subjectId">Môn học *</Label>
                <Select 
                  value={watch("subjectId")?.toString()} 
                  onValueChange={(value) => setValue("subjectId", parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn môn học" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id.toString()}>
                        {subject.name} ({subject.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.subjectId && (
                  <p className="text-sm text-red-500">{errors.subjectId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalQuestions">Số câu hỏi *</Label>
                <Input
                  id="totalQuestions"
                  type="number"
                  min="1"
                  max="100"
                  placeholder="10"
                  {...register("totalQuestions", {
                    required: "Số câu hỏi là bắt buộc",
                    min: { value: 1, message: "Tối thiểu 1 câu hỏi" },
                    max: { value: 100, message: "Tối đa 100 câu hỏi" },
                    valueAsNumber: true,
                  })}
                />
                {errors.totalQuestions && (
                  <p className="text-sm text-red-500">{errors.totalQuestions.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

           {/* Question Selection */}
           <Card>
            <CardHeader>
              <CardTitle>
                Chọn câu hỏi ({selectedQuestions.length}/{totalQuestions || 0})
              </CardTitle>
              <CardDescription>
                Cập nhật câu hỏi cho đề thi từ ngân hàng câu hỏi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!selectedSubjectId ? (
                <p className="text-muted-foreground text-center py-8">
                  Vui lòng chọn môn học trước
                </p>
              ) : filteredQuestions.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Không có câu hỏi nào cho môn học này
                </p>
              ) : (
                <>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAll}
                      disabled={!totalQuestions}
                      title="Chọn ngẫu nhiên câu hỏi từ danh sách"
                    >
                      Chọn ngẫu nhiên
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleClearAll}
                    >
                      Bỏ chọn tất cả
                    </Button>
                  </div>

                  <div className="max-h-96 overflow-y-auto space-y-2">
                    {filteredQuestions.map((question) => (
                      <div
                        key={question.id}
                        className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={selectedQuestions.includes(question.id)}
                          onChange={(e) => handleQuestionSelect(question.id, e.target.checked)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium mb-2">
                            {question.questionText.length > 100
                              ? `${question.questionText.substring(0, 100)}...`
                              : question.questionText}
                          </p>
                          <div className="flex gap-2 mt-1 items-center justify-between">
                            <div className="flex gap-2">
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyBgColor(question.difficultyLevel || "trung bình")}`}>
                                {question.difficultyLevel || "Chưa xác định"}
                              </span>
                              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                                {question.answers?.length || 0} đáp án
                              </span>
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
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Detailed Information */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin chi tiết</CardTitle>
              <CardDescription>
                Thông tin đầy đủ về đề thi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Details */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Thông tin cơ bản</h4>
                  
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">ID đề thi:</span>
                    <span className="text-sm text-muted-foreground">
                      #{examData.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Môn học:</span>
                    <span className="text-sm text-muted-foreground">
                      {examData.subject ? `${examData.subject.name} (${examData.subject.code})` : "Chưa xác định"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <PenTool className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Loại đề thi:</span>
                    <span className={`text-sm px-2 py-1 rounded-full font-medium ${
                      examData.examType === "official" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      {examData.examType === "official" ? "Chính thức" : "Luyện tập"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Thời gian:</span>
                    <span className="text-sm text-muted-foreground">
                      {examData.duration} phút
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Số câu hỏi:</span>
                    <span className="text-sm text-muted-foreground">
                      {examData.totalQuestions} câu
                    </span>
                  </div>
                </div>

                {/* Timestamps */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Thời gian</h4>
                  
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">Ngày tạo:</span>
                        <span className="text-sm text-muted-foreground">
                          {examData.createdAt ? formatDateTime(examData.createdAt) : "Chưa có thông tin"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">Cập nhật lần cuối:</span>
                        <span className="text-sm text-muted-foreground">
                          {examData.updatedAt ? formatDateTime(examData.updatedAt) : "Chưa có thông tin"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end">
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              onClick={() => handleSave(false)}
              disabled={isLoading}
              className="cursor-pointer bg-blue-600 hover:bg-blue-400"
            >
              {isLoading ? "Đang lưu..." : "Lưu"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => handleSave(true)}
              disabled={isLoading}
              className="cursor-pointer"
            >
              Lưu & Thoát
            </Button>
          </div>
        </div>
      </form>

      {/* Question Answers Modal */}
      <QuestionAnswersModal
        isOpen={isAnswersModalOpen}
        onClose={() => setIsAnswersModalOpen(false)}
        question={selectedQuestionForModal}
      />
    </div>
  );
};

export default EditExamPage; 