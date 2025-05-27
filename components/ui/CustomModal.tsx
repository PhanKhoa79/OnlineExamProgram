"use client";

import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CustomModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  trigger?: React.ReactNode;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
  submitLabel?: string;
  contentClassName?: string;

}

export function CustomModal({
  open,
  setOpen,
  title,
  trigger,
  children,
  onSubmit,
  loading = false,
  submitLabel = "Submit",
  contentClassName = "",
}: CustomModalProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>

      <DialogContent className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-400 overflow-hidden max-h-[90vh] w-[600px] overflow-y-auto overflow-x-auto rounded-lg p-6 ${contentClassName}`}>
        <DialogHeader>
          <DialogTitle className="dark:text-black">{title}</DialogTitle>
        </DialogHeader>

        <div className="contentClassName">
          <form id="reusable-dialog-form" onSubmit={onSubmit} className="grid gap-4 mt-4">
            {children}
          </form>

          <DialogFooter className="mt-4">
            <Button
              type="submit"
              form="reusable-dialog-form"
              disabled={loading}
              className="w-full dark:bg-gray-300 cursor-pointer"
            >
              {loading ? "Processing…" : submitLabel}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
