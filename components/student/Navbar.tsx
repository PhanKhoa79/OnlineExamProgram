'use client';

import Link from 'next/link';
import Image from 'next/image';
import ProfileAvatar from '@/components/ui/ProfileAvatar';
import { MobileSidebarToggle } from '@/components/ui/MobieSidebarToggle';

export const Navbar = () => {
  return (
    <nav className="bg-white px-4 py-2 border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between">
        {/* 🔹 Trái: Icon mở sidebar */}
        <div className="flex items-center gap-3">
          <MobileSidebarToggle />

          <Link href="/home" className="flex items-center gap-2 ml-4">
            <Image src="/logo.png" alt="Logo" width={32} height={32} />
            <span className="text-lg font-semibold text-gray-800">MegaStar</span>
          </Link>
        </div>

        {/* 🔹 Phải: Avatar */}
        <ProfileAvatar />
      </div>
    </nav>
  );
};
