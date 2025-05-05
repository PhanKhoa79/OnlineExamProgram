'use client';

import Link from 'next/link';
import Image from 'next/image';
import  ProfileAvatar  from '@/components/ui/ProfileAvatar';

export const Navbar = () => {
  return (
      <nav className="bg-white py-4 px-6 shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Logo" width={36} height={36
              
            } />
            <span className="font-outfit text-xl font-bold">MegaStart</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/home" className="text-[#5D5A88] hover:text-[#4A3AFF] transition-colors font-dm-sans">
              Home
            </Link>
            <Link href="/about" className="text-[#5D5A88] hover:text-[#4A3AFF] transition-colors font-dm-sans">
              About
            </Link>
            <Link href="/resources" className="text-[#5D5A88] hover:text-[#4A3AFF] transition-colors font-dm-sans">
              Resources
            </Link>
            <Link href="/contact" className="text-[#4A3AFF] font-dm-sans">
              Contact
            </Link>
          </div>

          <ProfileAvatar />
        </div>
      </nav>
    );
}