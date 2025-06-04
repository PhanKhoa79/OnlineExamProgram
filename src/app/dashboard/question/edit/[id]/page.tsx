'use client';

import { useParams } from 'next/navigation';
import EditQuestionPage from '@/features/question/components/EditQuestionPage';

export default function DashBoardEditQuestionPage() {
  const params = useParams();
  const id = Number(params.id);

  return (
    <EditQuestionPage id={id} />
  );
} 