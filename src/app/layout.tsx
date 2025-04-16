import '@/styles/globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'MegaStart Online',
  description: 'Website thi trắc nghiệm trực tuyến',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
