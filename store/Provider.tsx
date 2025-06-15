"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/store";
import { Toaster } from "sonner";
import QueryProvider from "./QueryProvider";
import { NotificationProvider } from "@/features/notifications/providers/NotificationProvider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <NotificationProvider>
        <QueryProvider>
          {children}
          <Toaster richColors position="top-right" />
        </QueryProvider>
      </NotificationProvider>
    </Provider>
  );
}
