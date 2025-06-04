'use client';

import { useParams } from 'next/navigation';
import { EditSubjectPage } from '@/features/subject/components';

export default function DashBoardEditSubjectPage() {
  const params = useParams();
  const id = Number(params.id);

  return (
    <EditSubjectPage id={id} />
  );
}