import "@/styles/globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import Providers from "@/store/Provider";

export const metadata: Metadata = {
  title: "MegaStart Online",
  description: "Website luyện tập và thi trắc nghiệm trực tuyến",
  keywords: "MegaStart, Online, Luyện tập, Thi trắc nghiệm",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
