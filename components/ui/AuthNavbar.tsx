import Image from 'next/image'
import Link from 'next/link'

export default function AuthNavbar() {

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative p-2 md:p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300" style={{ background: `linear-gradient(135deg, var(--color-primary, #4f46e5), var(--color-secondary, #9333ea))` }}>
                  <Image 
                    src="/logo.png" 
                    alt="Logo" 
                    width={24} 
                    height={24} 
                  />
            </div>            
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MegaStart
            </span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500 hidden sm:block">
              Hệ thống thi trực tuyến
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
} 