export interface CreateExamScheduleDto {
  code: string;
  startTime: string;
  endTime: string;
  status?: 'active' | 'completed' | 'cancelled';
  description?: string;
  subjectId: number;
  classIds?: number[];
}

export interface UpdateExamScheduleDto {
  code?: string;
  startTime?: string;
  endTime?: string;
  status?: 'active' | 'completed' | 'cancelled';
  description?: string;
  subjectId?: number;
  classIds?: number[];
}

export interface ExamScheduleDto {
  id: number;
  code: string;
  startTime: string;
  endTime: string;
  status: 'active' | 'completed' | 'cancelled';
  description?: string;
  subjectId?: number;
  subject?: {       
    id: number;
    name: string;
    code: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
  };
  classes?: Array<{
    id: number;
    name: string;
    code: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export type ScheduleStatus = 'active' | 'completed' | 'cancelled';
