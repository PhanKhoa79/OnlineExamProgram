'use client';

import { useRouter } from 'next/navigation';
import { AddAccountModal } from '@/features/account/components/modal/AddAccountModal';

export default function AddAccountModalPage() {
  const router = useRouter();

  return (
    <AddAccountModal open={true} onOpenChange={() => router.back()} />
  );
}
