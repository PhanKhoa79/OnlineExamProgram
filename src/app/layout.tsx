import '@/styles/globals.css'
import type { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'MegaStart Online',
  description: 'Website thi trắc nghiệm trực tuyến',
  icons: {
    icon: '/logo.png',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
        <body>{children}</body>
    </html>
  )
}
