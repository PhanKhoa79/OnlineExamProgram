// src/app/(student)/layout.tsx
import type { Metadata } from 'next'
import { ReactNode } from 'react'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { Navbar } from '@/components/student/Navbar'
import { checkUserRole } from '@/libs/checkRole'

export const metadata: Metadata = {
  title: 'Student Area - MegaStart Online',
  description: 'Trang dành cho sinh viên',
}

export default async function StudentLayout({ children }: { children: ReactNode }) {
  const role = await checkUserRole(['student']);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[#FAFAFC]">
        <Navbar />
        {children}
      </div>
    </ThemeProvider>
  )
}
