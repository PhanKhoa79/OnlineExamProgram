'use client';

import { useParams, useRouter } from 'next/navigation';
import { DetailClassModal } from '@/features/classes/components/modal/DetailClassModal';

export default function DetailClassModalPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  return (
    <DetailClassModal id={id} open={true} onOpenChange={() => router.back()} />
  );
} 