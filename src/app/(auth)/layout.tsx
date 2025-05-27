import { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-white flex items-center justify-center">
        <div className="w-full max-w-md bg-white/70 backdrop-blur-md shadow-xl rounded-3xl p-8 border border-gray-200">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl">
              ➡️
            </div>
          </div>
          {children}
        </div>
      </div>
  )
}