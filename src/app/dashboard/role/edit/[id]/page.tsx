'use client';

import { useParams } from 'next/navigation';
import  EditRolePage  from '@/features/role/components/EditRolePage';

export default function EditAccountModalPage() {
  const params = useParams();
  const id = Number(params.id);

  return (
    <EditRolePage id={id} />
  );
}
