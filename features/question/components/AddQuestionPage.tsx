"use client";

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "@/components/hooks/use-toast";
import AuthInput from "@/components/ui/AuthInput";
import { SaveOutlined, Create, Add, Delete } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { NavigableBreadcrumb } from "@/components/ui/NavigableBreadcrumb";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { createQuestion } from "../services/questionService";
import { addQuestion } from "@/store/questionSlice";
import { getAllSubjects } from "@/features/subject/services/subjectServices";
import { SubjectResponseDto } from "@/features/subject/types/subject";
import { CreateAnswerDto, DifficultyLevel } from "../types/question.type";

// Type for API error response
interface ApiError {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
  };
  message?: string;
}

export default function AddQuestionPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [questionText, setQuestionText] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [passageText, setPassageText] = useState<string>("");
  const [difficultyLevel, setDifficultyLevel] = useState<DifficultyLevel>("trung bình");
  const [subjectId, setSubjectId] = useState<number | undefined>();
  const [answers, setAnswers] = useState<CreateAnswerDto[]>([
    { answerText: "", isCorrect: false },
    { answerText: "", isCorrect: false }
  ]);

  const [subjects, setSubjects] = useState<SubjectResponseDto[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch subjects on component mount
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await getAllSubjects();
        setSubjects(data);
      } catch (error) {
        console.error("Failed to fetch subjects", error);
      }
    };
    fetchSubjects();
  }, []);

  const addAnswer = () => {
    setAnswers([...answers, { answerText: "", isCorrect: false }]);
  };

  const removeAnswer = (index: number) => {
    if (answers.length > 2) {
      setAnswers(answers.filter((_, i) => i !== index));
    }
  };

  const updateAnswer = (index: number, field: keyof CreateAnswerDto, value: string | boolean) => {
    const newAnswers = [...answers];
    newAnswers[index] = { ...newAnswers[index], [field]: value };
    setAnswers(newAnswers);
  };

  const handleCorrectAnswerChange = (index: number) => {
    const newAnswers = answers.map((answer, i) => ({
      ...answer,
      isCorrect: i === index
    }));
    setAnswers(newAnswers);
  };

  const validateForm = () => {
    if (!questionText.trim()) {
      toast({ title: "Vui lòng nhập nội dung câu hỏi", variant: "error" });
      return false;
    }
    
    const validAnswers = answers.filter(answer => answer.answerText.trim());
    if (validAnswers.length < 2) {
      toast({ title: "Cần có ít nhất 2 câu trả lời", variant: "error" });
      return false;
    }

    const hasCorrectAnswer = answers.some(answer => answer.isCorrect && answer.answerText.trim());
    if (!hasCorrectAnswer) {
      toast({ title: "Vui lòng chọn ít nhất một câu trả lời đúng", variant: "error" });
      return false;
    }

    if (!subjectId) {
      toast({ title: "Vui lòng chọn môn học", variant: "error" });
      return false;
    }

    return true;
  };

  const handleSubmit = async (exitAfterSave = false) => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const validAnswers = answers.filter(answer => answer.answerText.trim());
      
      const response = await createQuestion({
        questionText: questionText.trim(),
        imageUrl: imageUrl.trim() || undefined,
        audioUrl: audioUrl.trim() || undefined,
        passageText: passageText.trim() || undefined,
        difficultyLevel,
        answers: validAnswers,
        subjectId: subjectId!,
      });

      dispatch(addQuestion(response));
      toast({ title: "Tạo câu hỏi thành công" });
      
      if (exitAfterSave) {
        router.push("/dashboard/question");
      } else {
        router.push(`/dashboard/question/edit/${response.id}`);
      }
      
      // Reset form
      setQuestionText("");
      setImageUrl("");
      setAudioUrl("");
      setPassageText("");
      setDifficultyLevel("trung bình");
      setSubjectId(undefined);
      setAnswers([
        { answerText: "", isCorrect: false },
        { answerText: "", isCorrect: false }
      ]);
    } catch (error: unknown) {
      console.error("Error creating question:", error);
      
      let errorMessage = "Đã có lỗi xảy ra";
      
      const apiError = error as ApiError;

      if (apiError?.response?.data?.message) {
        errorMessage = apiError.response.data.message;
      } else if (apiError?.response?.data?.error) {
        errorMessage = apiError.response.data.error;
      } else if (apiError?.message) {
        errorMessage = apiError.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      toast({
        title: "Lỗi khi tạo câu hỏi",
        description: errorMessage,
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 px-6 py-4">
      <NavigableBreadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard", isHome: true },
          { label: "Câu hỏi", href: "/dashboard/question" },
          { label: "Thêm câu hỏi", isActive: true },
        ]}
      />

      <div className="text-center space-y-3 py-6">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-full shadow-lg">
          <Create className="h-6 w-6" />
          <h1 className="text-2xl font-bold tracking-tight">Thêm câu hỏi mới</h1>
        </div>
        <p className="text-lg text-gray-600 font-medium">
          Tạo câu hỏi mới với <span className="text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-full">các thông tin cần thiết</span>
        </p>
      </div>

      {/* Card */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>Tạo câu hỏi mới</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Question Text */}
          <div className="space-y-2">
            <Label htmlFor="questionText">Nội dung câu hỏi *</Label>
            <textarea
              id="questionText"
              placeholder="Nhập nội dung câu hỏi..."
              value={questionText}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setQuestionText(e.target.value)}
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            />
          </div>

          {/* Subject Selection */}
          <div className="space-y-2">
            <Label>Môn học *</Label>
            <Select onValueChange={(value) => setSubjectId(Number(value))}>
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
          </div>

          {/* Difficulty Level */}
          <div className="space-y-2">
            <Label>Độ khó</Label>
            <Select value={difficultyLevel} onValueChange={(value: DifficultyLevel) => setDifficultyLevel(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dễ">Dễ</SelectItem>
                <SelectItem value="trung bình">Trung bình</SelectItem>
                <SelectItem value="khó">Khó</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Optional fields */}
          <AuthInput
            id="imageUrl"
            title="URL hình ảnh (tùy chọn)"
            type="url"
            label="URL hình ảnh"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            Icon={Create}
          />

          <AuthInput
            id="audioUrl"
            title="URL âm thanh (tùy chọn)"
            type="url"
            label="URL âm thanh"
            value={audioUrl}
            onChange={(e) => setAudioUrl(e.target.value)}
            Icon={Create}
          />

          <div className="space-y-2">
            <Label htmlFor="passageText">Đoạn văn (tùy chọn)</Label>
            <textarea
              id="passageText"
              placeholder="Nhập đoạn văn liên quan đến câu hỏi..."
              value={passageText}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPassageText(e.target.value)}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            />
          </div>

          {/* Answers */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Câu trả lời *</Label>
              <Button type="button" onClick={addAnswer} variant="outline" size="sm">
                <Add className="w-4 h-4 mr-1" />
                Thêm câu trả lời
              </Button>
            </div>
            
            {answers.map((answer, index) => (
              <div key={index} className="flex gap-2 items-center">
                <div className="flex-1">
                  <AuthInput
                    id={`answer-${index}`}
                    title={`Câu trả lời ${index + 1}`}
                    type="text"
                    label={`Câu trả lời ${index + 1}`}
                    value={answer.answerText}
                    onChange={(e) => updateAnswer(index, 'answerText', e.target.value)}
                    Icon={Create}
                  />
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <label className="flex items-center gap-1 text-sm">
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={answer.isCorrect}
                      onChange={() => handleCorrectAnswerChange(index)}
                      className="text-blue-600"
                    />
                    Đúng
                  </label>
                  {answers.length > 2 && (
                    <Button
                      type="button"
                      onClick={() => removeAnswer(index)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-800"
                    >
                      <Delete className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end">
        <div className="flex items-center space-x-2">
          <Button onClick={() => handleSubmit(false)} disabled={loading} className="cursor-pointer bg-blue-600 hover:bg-blue-400">
            <SaveOutlined />
            Lưu
          </Button>
          <Button variant="secondary" onClick={() => handleSubmit(true)} disabled={loading} className="cursor-pointer">
            Lưu & Thoát
          </Button>
        </div>
      </div>
    </div>
  );
} 