'use client';

import { useParams, useRouter } from 'next/navigation';
import { DetailQuestionModal } from '@/features/question/components/modal/DetailQuestionModal';

export default function DetailQuestionModalPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  return (
    <DetailQuestionModal id={id} open={true} onOpenChange={() => router.back()} />
  );
} 