'use client';

import { useParams, useRouter } from 'next/navigation';
import { DetailRoleModal } from '@/features/role/components/modal/DetailRoleModal';

export default function DetailAccountModalPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  return (
    <DetailRoleModal id={id} open={true} onOpenChange={() => router.back()} />
  );
}
