export interface AnalyticsSummary {
    totalExams: number;
    totalStudents: number;
    averageScore: number;
    passRate: number;
    completionRate: number;
    weeklyGrowth: {
      exams: number;
      score: number;
      students: number;
    };
  }

export interface ScoreTrendsResponse {
  labels: string[];
  datasets: {
    averageScores: number[];
    practiceScores: number[];
    officialScores: number[];
    passRates: number[];
  };
}

export interface SubjectPerformanceItem {
  id: number;
  name: string;
  averageScore: number;
  passRate: number;
  totalExams: number;
  totalStudents: number;
  difficulty: 'easy' | 'medium' | 'hard';
  trend: 'up' | 'down' | 'stable';
}

export interface SubjectPerformanceResponse {
  subjects: SubjectPerformanceItem[];
}

// Query DTOs for API calls
export interface SubjectPerformanceQuery {
  classIds?: number[];
  subjectIds?: number[];
  examType?: 'practice' | 'official' | 'all';
  startDate?: string;
  endDate?: string;
  limit?: number;
}

export interface ScoreTrendsQuery {
  period?: 'daily' | 'weekly' | 'monthly';
  range?: number;
  classIds?: number[];
  subjectIds?: number[];
  examType?: 'practice' | 'official' | 'all';
}

export interface ClassPerformanceQuery {
  subjectIds?: number[];
  examType?: 'practice' | 'official' | 'all';
  startDate?: string;
  endDate?: string;
  includeStudentCount?: boolean;
}

// 🆕 Universal Analytics Types
export interface UniversalAnalyticsQuery {
  timePreset?: 'today' | '7days' | '1month' | '3months' | '6months' | '1year' | 'all_time' | 'custom';
  startDate?: string;
  endDate?: string;
  classIds?: number[];
  subjectIds?: number[];
  studentIds?: number[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string;
  type?: 'bar' | 'line';
}

export interface MatrixData {
  x: string;
  y: string;
  value: number;
  color: string;
  metadata?: {
    totalExams: number;
    passRate: number;
  };
}

export interface HierarchicalData {
  name: string;
  value?: number;
  size?: number;
  color?: string;
  children?: HierarchicalData[];
}

export interface ScatterData {
  x: number | string;
  y: number;
  label: string;
  metadata?: {
    className?: string;
    subjectName?: string;
    studentName?: string;
    additionalInfo?: Record<string, any>;
  };
}

export interface SummaryStats {
  totalExams: number;
  totalStudents: number;
  averageScore: number;
  passRate: number;
  topPerformer?: {
    name: string;
    type: 'class' | 'subject' | 'student';
    score: number;
  };
  insights: string[];
}

export interface UniversalAnalyticsResponse {
  config: {
    filterType: 'class' | 'subject' | 'student' | 'class+subject' | 'class+student' | 'subject+student' | 'all' | 'overview';
    chartRecommendation: 'bar' | 'line' | 'radar' | 'heatmap' | 'scatter' | 'treemap' | 'overview';
    title: string;
    subtitle: string;
    timeRange: string;
    granularity: 'daily' | 'weekly' | 'monthly';
  };
  data: {
    labels: string[];
    datasets?: ChartDataset[];
    matrix?: MatrixData[];
    hierarchy?: HierarchicalData[];
    points?: ScatterData[];
    summary: SummaryStats;
  };
  metadata: {
    totalRecords: number;
    dateRange: {
      start: string;
      end: string;
    };
    appliedFilters: {
      classes?: string[];
      subjects?: string[];
      students?: string[];
    };
  };
}

// 🆕 Exam Volume Types - Updated to match backend DTOs
export interface ExamVolumeQuery {
  specificDate?: string;
  startDate?: string;
  endDate?: string;
  examType?: 'practice' | 'official' | 'all';
  classIds?: number[];
  subjectIds?: number[];
  studentIds?: number[];
  groupBy?: 'daily' | 'weekly' | 'monthly';
}

export interface ExamVolumeSummary {
  totalPractice: number;
  totalOfficial: number;
  totalExams: number;
  averagePerDay: number;
}

export interface ExamVolumeDataPoint {
  date: string;
  practiceCount: number;
  officialCount: number;
  totalCount: number;
  practicePercentage?: number;
  officialPercentage?: number;
}

export interface ExamVolumeResponse {
  success: boolean;
  summary: ExamVolumeSummary;
  data: ExamVolumeDataPoint[];
  filters: {
    examType: string;
    dateRange: {
      startDate: string;
      endDate: string;
    };
    classIds?: number[];
    subjectIds?: number[];
    studentIds?: number[];
    groupBy: string;
  };
  insights?: {
    practiceUsage: string;
    peakTimes: string;
    recommendations: string[];
  };
}

// Score Statistics Types
export interface ScoreStatisticsQuery {
  specificDate?: string;
  startDate?: string;
  endDate?: string;
  groupBy?: 'daily' | 'weekly' | 'monthly';
  examType?: 'practice' | 'official' | 'all';
  classIds?: number[];
  subjectIds?: number[];
  studentIds?: number[];
}

export interface ScoreStatisticsDataPoint {
  date: string;
  practiceStats: {
    averageScore: number;
    minScore: number;
    maxScore: number;
    count: number;
    standardDeviation: number;
  };
  officialStats: {
    averageScore: number;
    minScore: number;
    maxScore: number;
    count: number;
    standardDeviation: number;
  };
  overallStats: {
    averageScore: number;
    minScore: number;
    maxScore: number;
    count: number;
    standardDeviation: number;
  };
}

export interface ScoreStatisticsSummary {
  practiceExams: {
    totalCount: number;
    averageScore: number;
    minScore: number;
    maxScore: number;
    standardDeviation: number;
    scoreDistribution: {
      excellent: number;    // 90-100 điểm
      good: number;         // 80-89 điểm
      average: number;      // 70-79 điểm
      belowAverage: number; // 60-69 điểm
      poor: number;         // < 60 điểm
    };
  };
  officialExams: {
    totalCount: number;
    averageScore: number;
    minScore: number;
    maxScore: number;
    standardDeviation: number;
    scoreDistribution: {
      excellent: number;
      good: number;
      average: number;
      belowAverage: number;
      poor: number;
    };
  };
  comparison: {
    averageScoreDifference: number;
    performanceTrend: 'practice_better' | 'official_better' | 'similar';
    consistencyComparison: 'practice_more_consistent' | 'official_more_consistent' | 'similar';
  };
}

export interface ScoreStatisticsInsights {
  scoreImprovement: string;
  consistencyAnalysis: string;
  recommendations: string[];
}

export interface ScoreStatisticsResponse {
  success: boolean;
  summary: ScoreStatisticsSummary;
  data: ScoreStatisticsDataPoint[];
  filters: {
    applied: ScoreStatisticsQuery;
    totalRecords: number;
  };
  insights: ScoreStatisticsInsights;
}

// Top Students interfaces
export interface TopStudentItem {
  rank: number;
  studentId: string;
  studentName: string;
  className: string;
  averageScore: number;
  examCount: number;
}

export interface TopStudentsQuery {
  classIds?: number[];
  subjectIds?: number[];
  limit?: number;
  startDate?: string;
  endDate?: string;
}

export interface TopStudentsResponseDto {
  success: boolean;
  data: TopStudentItem[];
}

// Failing Students Types
export enum FailureLevelEnum {
  SEVERE = 'severe', // < 30 điểm
  MODERATE = 'moderate', // 30-49 điểm
  ALL = 'all', // tất cả học sinh không đạt
}

export interface FailingStudentsQuery {
  classIds?: number[];
  subjectIds?: number[];
  specificDate?: string; // YYYY-MM-DD
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  failureLevel?: FailureLevelEnum;
  limit?: number;
  page?: number;
  sortByScore?: 'asc' | 'desc';
}

export interface FailingStudentItem {
  studentId: string;
  studentName: string;
  className: string;
  examName: string;
  subject: string;
  score: number;
  maxScore: number;
  examDate: string; // ISO format
  examType: 'practice' | 'official';
  failureLevel: 'severe' | 'moderate';
}

export interface FailingStudentsResponse {
  success: boolean;
  data: FailingStudentItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  summary: {
    totalFailingStudents: number;
    severeFailures: number; // < 30 điểm
    moderateFailures: number; // 30-49 điểm
  };
  filters: {
    classIds?: number[];
    subjectIds?: number[];
    specificDate?: string;
    startDate?: string;
    endDate?: string;
    failureLevel?: string;
  };
}