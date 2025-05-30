'use client';

import { useRouter } from 'next/navigation';
import ListStudentModal from '@/features/account/components/modal/ListStudentModal';

export default function UploadStudentModalPage() {
  const router = useRouter();

  return (
    <ListStudentModal open={true} onOpenChange={() => router.back()} />
  );
}
