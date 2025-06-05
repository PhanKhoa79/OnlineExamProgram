"use client";

import React, { useState, useEffect } from "react";
import { Edit, Delete } from "@mui/icons-material";
import { CustomModal } from "@/components/ui/CustomModal";
import { getQuestionById, getAllQuestions, deleteQuestion } from "../../services/questionService";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store";
import { hasPermission } from "@/lib/permissions";
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';
import { toast } from '@/components/hooks/use-toast';
import { useDispatch } from 'react-redux';
import { setQuestions } from "@/store/questionSlice";
import { QuestionDto } from "../../types/question.type";
import { getSubjectById } from "@/features/subject/services/subjectServices";

type DetailQuestionModalProps = {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  id: number;
};

export function DetailQuestionModal({ open, onOpenChange, id }: DetailQuestionModalProps) {
  const dispatch = useDispatch();
  const router = useRouter();

  const [questionData, setQuestionData] = useState<QuestionDto | null>(null);
  const [subjectName, setSubjectName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const permissions = useAuthStore((state) => state.permissions);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    const fetchQuestionData = async () => {
      try {
        setIsLoading(true);
        const res = await getQuestionById(id);
        if (res) {
          setQuestionData(res);
          
          // Fetch subject name if subjectId exists
          if (res.subjectId) {
            try {
              const subject = await getSubjectById(res.subjectId);
              setSubjectName(subject.name);
            } catch (error) {
              console.error("Error fetching subject:", error);
              setSubjectName("Không xác định");
            }
          } else {
            setSubjectName("Chưa phân loại");
          }
        } else {
          toast({
            title: "Error",
            description: "Lỗi khi lấy thông tin câu hỏi",
            variant: "error",
          });
        }
      } catch (error) {
        console.error("Error fetching question data:", error);
        toast({
          title: "Error",
          description: "Lỗi khi lấy thông tin câu hỏi",
          variant: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id && open) {
      fetchQuestionData();
    }
  }, [id, open]);

  if (isLoading) {
    return (
      <CustomModal
        open={open}
        setOpen={onOpenChange}
        title="Chi tiết câu hỏi"
        submitLabel=""
        isSubmit={false}
      >
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </CustomModal>
    );
  }

  const difficultyColors = {
    'dễ': 'bg-green-100 text-green-800',
    'trung bình': 'bg-yellow-100 text-yellow-800',
    'khó': 'bg-red-100 text-red-800'
  };

  return (
    <CustomModal
      open={open}
      setOpen={onOpenChange}
      title="Chi tiết câu hỏi"
      submitLabel=""
      isSubmit={false}
    >
      <div className="flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
        {/* Question Text */}
        <div className="flex flex-col gap-2 dark:text-black">
          <span className="block text-sm font-bold text-black-700 dark:text-white">
            Nội dung câu hỏi
          </span>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
              {questionData?.questionText}
            </p>
          </div>
        </div>

        {/* Basic Information */}
        <div className="flex flex-col gap-2">
          <span className="block text-sm font-bold text-black-700 dark:text-white">
            Thông tin cơ bản
          </span>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-400">ID:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{questionData?.id}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-400">Môn học:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{subjectName}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-400">Độ khó:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[questionData?.difficultyLevel || 'trung bình']}`}>
                  {questionData?.difficultyLevel || 'Chưa xác định'}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-400">Số câu trả lời:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{questionData?.answers?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Answers */}
        {questionData?.answers && questionData.answers.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="block text-sm font-bold text-black-700 dark:text-white">
              Các câu trả lời
            </span>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-3">
              {questionData.answers.map((answer, index) => (
                <div key={answer.id} className="flex items-start gap-3 p-3 bg-white dark:bg-gray-700 rounded-lg">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <div className="flex-1">
                    <p className="text-gray-900 dark:text-white">{answer.answerText}</p>
                    {answer.isCorrect && (
                      <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                        ✓ Câu trả lời đúng
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Optional Content */}
        {(questionData?.passageText || questionData?.imageUrl || questionData?.audioUrl) && (
          <div className="flex flex-col gap-2">
            <span className="block text-sm font-bold text-black-700 dark:text-white">
              Nội dung bổ sung
            </span>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-3">
              {questionData.passageText && (
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400 block mb-2">Đoạn văn:</span>
                  <p className="text-gray-900 dark:text-white whitespace-pre-wrap bg-white dark:bg-gray-700 p-3 rounded">
                    {questionData.passageText}
                  </p>
                </div>
              )}
              {questionData.imageUrl && (
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400 block mb-2">Hình ảnh:</span>
                  <img 
                    src={questionData.imageUrl} 
                    alt="Question image" 
                    className="max-w-full h-auto rounded border"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling!.textContent = 'Không thể tải hình ảnh';
                    }}
                  />
                  <span className="text-red-500 text-sm hidden"></span>
                </div>
              )}
              {questionData.audioUrl && (
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400 block mb-2">Audio:</span>
                  <audio controls className="w-full">
                    <source src={questionData.audioUrl} />
                    Trình duyệt không hỗ trợ phát audio.
                  </audio>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between gap-4 mt-6">
          {hasPermission(permissions, "question:update") && (
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors duration-200"
              onClick={() => {
                onOpenChange(false);
                setTimeout(() => {
                  router.push(`/dashboard/question/edit/${id}`);
                }, 50);
              }}
            >
              <Edit fontSize="small" />
              Chỉnh sửa
            </button>
          )}

          {hasPermission(permissions, "question:delete") && (
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
          title="Bạn có chắc chắn muốn xóa câu hỏi này?"
          open={showConfirmDelete}
          onOpenChange={setShowConfirmDelete}
          onConfirm={async () => {
            try {
              await deleteQuestion(id);
              const data = await getAllQuestions();
              dispatch(setQuestions(data));
              setShowConfirmDelete(false);
              onOpenChange(false);
              toast({ 
                title: 'Xóa câu hỏi thành công!'
              });
              router.refresh();
            } catch (err: unknown) {
              toast({
                title: 'Lỗi khi xóa câu hỏi',
                description: err instanceof Error 
                  ? err.message 
                  : (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Không thể xóa câu hỏi',
                variant: 'error',
              });
            }
          }}
        />
      </div>
    </CustomModal>
  );
} 