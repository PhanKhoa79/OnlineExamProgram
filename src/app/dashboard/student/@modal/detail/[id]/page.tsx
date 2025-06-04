"use client";

import { DetailStudentModal } from "@/features/student/ui/modal/DetailStudentModal";
import { useParams, useRouter } from "next/navigation";


export default function DetailStudentPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  return (
    <DetailStudentModal
    id={id} open={true} onOpenChange={() => router.back()}
    />
  );
} 