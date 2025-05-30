'use client';

import { useParams, useRouter } from 'next/navigation';
import DetailAccountModal from '@/features/account/components/modal/DetailAccountModal';

export default function DetailAccountModalPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  return (
    <DetailAccountModal id={id} open={true} onOpenChange={() => router.back()} />
  );
}
