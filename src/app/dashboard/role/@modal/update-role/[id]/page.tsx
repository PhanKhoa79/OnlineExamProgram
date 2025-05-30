'use client';

import { useRouter, useParams } from 'next/navigation';
import { EditRoleModal } from '@/features/role/components/modal/EditRoleModal';

export default function EditRoleModalPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  return (
    <EditRoleModal id={id} open={true} onOpenChange={() => router.back()} />
  );
}
