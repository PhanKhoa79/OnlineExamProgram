import type { Metadata } from 'next'
import { ReactNode } from 'react'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { Navbar } from '@/components/ui/Navbar'

export const metadata: Metadata = {
  title: 'Contact - MegaStart Online',
  description: 'Get in touch with our team',
}

export default function ContactLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <ThemeProvider>
        <div className="min-h-screen bg-[#FAFAFC]">
            <Navbar variant="contact"/>
            {children}
        </div>
    </ThemeProvider>
  )
}