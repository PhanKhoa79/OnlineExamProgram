'use client'

import Image from 'next/image'
import { ChevronDown } from 'lucide-react'

export default function ProfileAvatar() {
  return (
    <div className="flex items-center space-x-2 cursor-pointer hover:opacity-90 transition">
        <div className="w-9 h-9 rounded-full overflow-hidden">
        <Image
            src="/logo.png"
            alt="Profile"
            width={36}
            height={36}
            className="object-cover w-full h-full"
        />
        </div>
        <ChevronDown className="w-4 h-4 text-gray-500" />
  </div>
  )
}
