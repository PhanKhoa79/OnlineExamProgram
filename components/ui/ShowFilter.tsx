"use client";

import * as React from "react";
import { ShowOption } from "@/hooks/useShowFilter";

interface ShowFilterProps {
  show: ShowOption;
  onChange: (option: ShowOption) => void;
}

const OPTIONS: { value: ShowOption; label: string }[] = [
  { value: "all",    label: "Tất cả" },
  { value: "role",   label: "Quyền" },
  { value: "email",  label: "Email" },
  { value: "status", label: "Trạng thái" },
];

export function ShowFilter({ show, onChange }: ShowFilterProps) {
  return (
    <fieldset className="flex flex-wrap items-center space-x-6">
      <legend className="sr-only">Show Columns</legend>
      <span className="font-medium">Hiển thị:</span>

      {OPTIONS.map((opt) => (
        <label key={opt.value} className="inline-flex items-center space-x-2 cursor-pointer ">
          <input
            type="radio"
            name="show-filter"
            value={opt.value}
            checked={show === opt.value}
            onChange={() => onChange(opt.value)}
            className="w-4 h-4 accent-blue-600"
          />
          <span className="text-sm text-gray-800 dark:text-white">{opt.label}</span>
        </label>
      ))}
    </fieldset>
  );
}
