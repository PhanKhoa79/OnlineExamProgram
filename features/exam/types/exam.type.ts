import { SubjectResponseDto } from "@/features/subject/types/subject";

export interface CreateExamDto {
    name: string;
    duration: number;
    examType: "practice" | "official";
    totalQuestions: number;
    subjectId: number;
    questionIds?: number[];
}
  
export interface UpdateExamDto {
    name?: string;
    duration?: number;
    examType?: "practice" | "official";
    totalQuestions?: number;
    subjectId?: number;
    questionIds?: number[];
}

export interface ExamDto {
    id: number;
    name: string;
    duration: number;
    examType: "practice" | "official";
    totalQuestions: number;
    subject: SubjectResponseDto;
    questionIds?: number[];
    createdAt: string;
    updatedAt: string;
}
