"use client";

import { toast as sonnerToast } from "sonner";

type ToastVariant = "default" | "destructive";

export function toast({
  title,
  description,
  duration = 3000,
  action,
  variant = "default",
}: {
  title: string;
  description?: React.ReactNode;
  duration?: number;
  action?: React.ReactNode;
  variant?: ToastVariant;
}) {
  // 1. Định nghĩa các class theo variant
  const baseClasses = "rounded-md p-4 shadow-lg";
  const variantClasses =
    variant === "destructive"
      ? "bg-red-50 border border-red-200 text-red-800"
      : "bg-green border border-gray-200 text-gray-900";

  // 2. Render custom toast với style tương ứng
  return sonnerToast.custom(
    (t) => (
      <div className={`${baseClasses} ${variantClasses}`}>
        <div className="font-medium text-lg">{title}</div>
        {description && (
          <div className="mt-2 text-gray-600 text-sm">{description}</div>
        )}
        {action && <div className="mt-3">{action}</div>}
      </div>
    ),
    { duration }
  );
}
