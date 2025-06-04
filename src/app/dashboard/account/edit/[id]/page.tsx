'use client';

import { useParams } from 'next/navigation';
import EditAccountPage from '@/features/account/components/EditAccoutPage';

export default function EditAccountModalPage() {
  const params = useParams();
  const id = Number(params.id);

  return (
    <EditAccountPage id={id} />
  );
}
