'use client';

import { useParams, useRouter } from 'next/navigation';
import EditAccountModal from '@/features/account/components/modal/EditAccountModal';

export default function EditAccountModalPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  return (
    <EditAccountModal id={id} open={true} onOpenChange={() => router.back()} />
  );
}
