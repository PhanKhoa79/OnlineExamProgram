'use client';

import { useParams, useRouter } from 'next/navigation';
import { DetailSubjectModal } from '@/features/subject/components/modal/DetailSubjectModal';

export default function DetailSubjectModalPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  return (
    <DetailSubjectModal id={id} open={true} onOpenChange={() => router.back()} />
  );
} 