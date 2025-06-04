export interface ClassResponseDto {
    id: number;
    name: string;
    code: string;
    createdAt: string;
    updatedAt: string;
  }
export interface CreateClassDto {
    name: string;
    code?: string;
}
  

export interface UpdateClassDto {
    name?: string;
    code?: string;
}
