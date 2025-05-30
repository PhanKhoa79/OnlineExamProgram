'use client';

import { useRouter } from 'next/navigation';
import { AddRoleModal } from '@/features/role/components/modal/AddRoleModal';

export default function AddRoleModalPage() {
  const router = useRouter();

  return (
    <AddRoleModal open={true} onOpenChange={() => router.back()} />
  );
}
