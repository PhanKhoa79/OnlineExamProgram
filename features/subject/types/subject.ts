export interface CreateSubjectDto {
    name: string;
    code: string;
    description?: string;   
}

export interface UpdateSubjectDto {
    name?: string;
    code?: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface SubjectResponseDto {
    id: number;
    name: string;
    code: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}