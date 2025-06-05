"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { QuestionDto } from "@/features/question/types/question.type";

interface QuestionAnswersModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: QuestionDto | null;
}

export const QuestionAnswersModal: React.FC<QuestionAnswersModalProps> = ({
  isOpen,
  onClose,
  question,
}) => {
  if (!question) return null;

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "dễ":
        return "bg-green-100 text-green-800 border-green-200";
      case "trung bình":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "khó":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Chi tiết câu hỏi</DialogTitle>
          <DialogDescription>
            Xem nội dung câu hỏi và các đáp án
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Question Info */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={`${getDifficultyColor(question.difficultyLevel || "trung bình")} border`}>
              {question.difficultyLevel || "Chưa xác định"}
            </Badge>
            <Badge variant="outline">
              {question.answers?.length || 0} đáp án
            </Badge>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Nội dung câu hỏi:</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                {question.questionText}
              </p>
            </div>
          </div>

          {/* Passage if exists */}
          {question.passageText && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Đoạn văn:</h4>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                  {question.passageText}
                </p>
              </div>
            </div>
          )}

          {/* Image if exists */}
          {question.imageUrl && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Hình ảnh:</h4>
              <img 
                src={question.imageUrl} 
                alt="Question image" 
                className="max-w-full h-auto rounded-lg border"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Audio if exists */}
          {question.audioUrl && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Audio:</h4>
              <audio controls className="w-full">
                <source src={question.audioUrl} />
                Trình duyệt không hỗ trợ phát audio.
              </audio>
            </div>
          )}

          {/* Answers */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Các đáp án:</h4>
            <div className="space-y-2">
              {question.answers && question.answers.length > 0 ? (
                question.answers.map((answer, index) => (
                  <div
                    key={answer.id || index}
                    className={`flex items-start gap-3 p-3 rounded-lg border ${
                      answer.isCorrect
                        ? "bg-green-50 border-green-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <div className="flex-1">
                      <p className="text-gray-900">{answer.answerText}</p>
                      {answer.isCorrect && (
                        <div className="flex items-center gap-1 mt-1">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-green-600 text-sm font-medium">
                            Đáp án đúng
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">Chưa có đáp án nào</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 