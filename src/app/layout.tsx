// src/app/dashboard/layout.tsx
import '@/styles/globals.css'
import type { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'MegaStart Online',
  description: 'Website luyện tập và thi trắc nghiệm trực tuyến',
  keywords: 'MegaStart, Online, Luyện tập, Thi trắc nghiệm',
  icons: {
    icon: '/logo.png',
  },
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
