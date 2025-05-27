"use client";

import { toast as sonnerToast } from "sonner";
import { CheckCircle, AlertCircle, XCircle, X } from "lucide-react";

type ToastVariant = "success" | "warning" | "error";

export function toast({
  title,
  description,
  duration = 3000,
  action,
  variant = "success",
}: {
  title: string;
  description?: React.ReactNode;
  duration?: number;
  action?: React.ReactNode;
  variant?: ToastVariant;
}) {
  // 1️⃣ Define variant styles
  const variantConfig = {
    success: {
      bg: "bg-green-50 border-green-200 text-green-800",
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
    },
    warning: {
      bg: "bg-yellow-50 border-yellow-200 text-yellow-800",
      icon: <AlertCircle className="w-6 h-6 text-yellow-600" />,
    },
    error: {
      bg: "bg-red-50 border-red-200 text-red-800",
      icon: <XCircle className="w-6 h-6 text-red-600" />,
    },
  };

  const { bg, icon } = variantConfig[variant];

  // 2️⃣ Render custom toast
  return sonnerToast.custom(
    (t) => (
      <div
        className={`flex items-center gap-3 rounded-sm border p-2 shadow-lg w-[300px] ${bg}`}
      >
        <div>{icon}</div>
        <div className="flex-1">
          <div className="font-semibold text-base pr-0.5">{title}</div>
          {description && (
            <div className="mt-1 text-sm opacity-80">{description}</div>
          )}
          {action && <div className="mt-2">{action}</div>}
        </div>

         {/* Close button */}
        <button
          onClick={() => sonnerToast.dismiss(t.id)}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    ),
    { duration }
  );
}
