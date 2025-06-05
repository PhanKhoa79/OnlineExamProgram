'use client';

import { useParams, useRouter } from 'next/navigation';
import { DetailExamModal } from '@/features/exam/components/modal/DetailExamModal';

export default function DetailExamModalPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  return (
    <DetailExamModal 
      examId={id} 
      isOpen={true} 
      onClose={() => router.back()} 
    />
  );
} 