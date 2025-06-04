'use client';

import { EditStudentPage } from "@/features/student/ui/EditStudentPage";
import { useParams } from "next/navigation";


export default function EditStudent() {
  const params = useParams();
  const id = Number(params.id);
  return <EditStudentPage id={id} />;
} 