export interface CreateExamDto {
    name: string;
    duration: number;
    examType: "practice" | "official";
    totalQuestions: number;
    subjectId: number;
    questionIds: number[];
}
  
export interface UpdateExamDto {
    name?: string;
    duration?: number;
    examType?: "practice" | "official";
    totalQuestions?: number;
    subjectId?: number;
    questionIds?: number[];
}
