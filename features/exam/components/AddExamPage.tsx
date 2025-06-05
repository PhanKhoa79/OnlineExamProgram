"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { createExam } from "@/features/exam/services/examServices";
import { getAllSubjects } from "@/features/subject/services/subjectServices";
import { getAllQuestions } from "@/features/question/services/questionService";
import { CreateExamDto } from "@/features/exam/types/exam.type";
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
import { randomSelect } from "@/lib/arrayUtils";
import { QuestionAnswersModal } from "@/components/ui/QuestionAnswersModal";
import { getDifficultyBgColor } from "@/lib/difficultyUtils";
import { Eye } from "lucide-react";

const AddExamPage: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [subjects, setSubjects] = useState<SubjectResponseDto[]>([]);
  const [questions, setQuestions] = useState<QuestionDto[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<QuestionDto[]>([]);
  const [selectedQuestionForModal, setSelectedQuestionForModal] = useState<QuestionDto | null>(null);
  const [isAnswersModalOpen, setIsAnswersModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CreateExamDto>();

  const selectedSubjectId = watch("subjectId");
  const totalQuestions = watch("totalQuestions");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subjectsData, questionsData] = await Promise.all([
          getAllSubjects(),
          getAllQuestions(),
        ]);
        setSubjects(subjectsData);
        setQuestions(questionsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast({
          title: "Lỗi khi tải dữ liệu",
          variant: "error",
        });
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedSubjectId) {
      const filtered = questions.filter(
        (q) => q.subjectId === parseInt(selectedSubjectId.toString())
      );
      setFilteredQuestions(filtered);
    } else {
      setFilteredQuestions([]);
    }
    setSelectedQuestions([]);
  }, [selectedSubjectId, questions]);

  const onSubmit = async (data: CreateExamDto, exitAfterSave = false) => {
    try {
      setIsLoading(true);

      if (selectedQuestions.length !== data.totalQuestions && selectedQuestions.length > 0) {
        toast({
          title: "Số câu hỏi không khớp",
          description: `Bạn đã chọn ${selectedQuestions.length} câu hỏi nhưng đặt tổng số là ${data.totalQuestions}. Đề thi vẫn sẽ được cập nhật.`,
          variant: "warning",
        });
      }

      if (selectedQuestions.length === 0) {
        toast({
          title: "Bạn chưa chọn câu hỏi nào",
          description: "Đề thi sẽ được tạo và bạn có thể thêm câu hỏi sau.",
          variant: "warning",
        });
      }

      const examData: CreateExamDto = {
        name: data.name,
        duration: data.duration,
        examType: data.examType,
        totalQuestions: data.totalQuestions,
        subjectId: data.subjectId,
        questionIds: selectedQuestions.length > 0 ? selectedQuestions : undefined,
      };

      const response = await createExam(examData);

      toast({
        title: "Tạo đề thi thành công!",
        description: selectedQuestions.length > 0 
          ? `Đã thêm ${selectedQuestions.length} câu hỏi` 
          : "Bạn có thể chỉnh sửa để thêm câu hỏi sau",
      });

      if (exitAfterSave) {
        router.push("/dashboard/exam");
      } else {
        router.push(`/dashboard/exam/edit/${response.id}`);
      }

      reset();
      setSelectedQuestions([]);
    } catch (error) {
      console.error("Error creating exam:", error);
      toast({
        title: "Lỗi khi tạo đề thi",
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
        <BreadcrumbItem>Thêm đề thi</BreadcrumbItem>
      </Breadcrumb>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Thêm đề thi mới</h1>
        <p className="text-muted-foreground">
          Tạo đề thi mới với các câu hỏi đã có
        </p>
      </div>

      <form onSubmit={handleSubmit((data) => onSubmit(data, false))} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
              <CardDescription>
                Nhập thông tin cơ bản của đề thi
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
                <Select onValueChange={(value) => setValue("examType", value as "practice" | "official")}>
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
                <Select onValueChange={(value) => setValue("subjectId", parseInt(value))}>
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
                Chọn câu hỏi ({selectedQuestions.length}/{totalQuestions || 0}) - Tùy chọn
              </CardTitle>
              <CardDescription>
                Chọn câu hỏi cho đề thi từ ngân hàng câu hỏi. Bạn có thể bỏ qua bước này và thêm câu hỏi sau khi tạo đề thi.
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
                      className="cursor-pointer"
                      title="Chọn ngẫu nhiên câu hỏi từ danh sách"
                    >
                      Chọn ngẫu nhiên
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleClearAll}
                      className="cursor-pointer"
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

export default AddExamPage; 