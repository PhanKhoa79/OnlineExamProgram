export interface CreateAnswerDto {
    answerText: string;
    isCorrect?: boolean;
  }
  
export interface CreateQuestionDto {
    questionText: string;
    imageUrl?: string;
    audioUrl?: string;
    passageText?: string;
    difficultyLevel?: DifficultyLevel;
    answers: CreateAnswerDto[];
    subjectId: number;
}

export interface UpdateAnswerDto {
    id?: number;
    answerText: string;
    isCorrect: boolean;
}

export interface UpdateQuestionDto {
    questionText?: string;
    imageUrl?: string;
    audioUrl?: string;
    passageText?: string;
    difficultyLevel?: DifficultyLevel;
    answers?: UpdateAnswerDto[];
    subjectId?: number;
}

export interface AnswerDto {
    id: number;
    answerText: string;
    isCorrect: boolean;
}

export interface QuestionDto {
    id: number;
    questionText: string;
    imageUrl?: string;
    audioUrl?: string;
    passageText?: string;
    difficultyLevel?: DifficultyLevel;
    subjectId: number | null;
    createdAt: string;
    updatedAt: string;
    answers: AnswerDto[];
}

export type DifficultyLevel = 'dễ' | 'trung bình' | 'khó';
