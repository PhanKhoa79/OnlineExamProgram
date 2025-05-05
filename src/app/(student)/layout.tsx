// src/app/(student)/layout.tsx
import type { Metadata } from 'next'
import { ReactNode } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { decode } from 'jsonwebtoken'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { Navbar } from '@/components/ui/Navbar'

export const metadata: Metadata = {
  title: 'Student Area - MegaStart Online',
  description: 'Trang dành cho sinh viên',
}

export default async function StudentLayout({
  children,
}: {
  children: ReactNode
}) {
  const cookieStore = await cookies();

  const token = cookieStore.get('accessToken')?.value

  const decoded = decode(token)
  if (
    !decoded ||
    typeof decoded !== 'object' ||
    !('role' in decoded)
  ) {
  }

  const role = (decoded as { role?: string }).role
  if (role !== 'student') {
    redirect('/for-bidden')
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[#FAFAFC]">
        <Navbar variant="contact" />
        {children}
      </div>
    </ThemeProvider>
  )
}
