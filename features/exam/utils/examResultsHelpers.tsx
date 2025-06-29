import { Badge } from '@/components/ui/badge';

// Helper functions for styling
export const getRankBadge = (rank: number) => {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `#${rank}`;
};

export const getRankColor = (rank: number) => {
  if (rank === 1) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  if (rank === 2) return 'text-gray-600 bg-gray-50 border-gray-200';
  if (rank === 3) return 'text-orange-600 bg-orange-50 border-orange-200';
  return 'text-blue-600 bg-blue-50 border-blue-200';
};

// Helper functions for failing students
export const getFailureLevelBadge = (level: string) => {
  switch (level) {
    case 'severe':
      return <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200">🚨 Nghiêm trọng</Badge>;
    case 'moderate':
      return <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300 hover:bg-orange-200">⚠️ Trung bình</Badge>;
    default:
      return <Badge variant="secondary">Khác</Badge>;
  }
};

export const getFailureLevelColor = (level: string) => {
  switch (level) {
    case 'severe':
      return 'border-l-red-500 bg-red-50';
    case 'moderate':
      return 'border-l-orange-500 bg-orange-50';
    default:
      return 'border-l-gray-500 bg-gray-50';
  }
};

export const getScoreColor = (score: number) => {
  if (score >= 90) return 'text-green-600';
  if (score >= 80) return 'text-blue-600';
  if (score >= 70) return 'text-yellow-600';
  return 'text-red-600';
};

export const getScoreBadgeVariant = (score: number) => {
  if (score >= 85) return 'default'; // Xuất sắc 
  if (score >= 70) return 'secondary'; // Khá
  if (score >= 50) return 'outline'; // Trung bình
  return 'destructive'; // Yếu
};

export const getTypeBadge = (type: string) => {
  return type === 'official' 
    ? <Badge variant="default" className="bg-blue-100 text-blue-800 hover:bg-blue-200">Chính thức</Badge>
    : <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">Luyện tập</Badge>;
};

export const formatDateTime = (dateTimeString: string) => {
  const date = new Date(dateTimeString);
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}; 