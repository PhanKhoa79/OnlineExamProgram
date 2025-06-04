'use client';

import { useParams } from 'next/navigation';
import EditClassPage from '@/features/classes/components/EditClassPage';

export default function DashBoardEditClassPage() {
  const params = useParams();
  const id = Number(params.id);

  return (
    <EditClassPage id={id} />
  );
}
