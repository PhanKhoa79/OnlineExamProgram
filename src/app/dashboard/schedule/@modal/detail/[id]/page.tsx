"use client";

import { useRouter, useParams } from "next/navigation";
import { DetailScheduleModal } from "@/features/schedule/components/modal/DetailScheduleModal";

export default function ScheduleDetailModalPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);


  return (
    <DetailScheduleModal
      id={id}
      open={true}
      onOpenChange={() => router.back()}
    />
  );
} 