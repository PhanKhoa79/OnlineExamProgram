'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Shield } from 'lucide-react';
import { Navbar } from '@/components/student/Navbar'; 

const tabs = [
  { href: '/account/profile', label: 'Thông tin cá nhân', icon: <User className="w-4 h-4" /> },
  { href: '/account/security', label: 'Bảo mật', icon: <Shield className="w-4 h-4" /> },
];

export default function AccountLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#FAFAFC]">
      <Navbar />

      <div className="flex">
        <aside className="w-[250px] min-h-[calc(100vh-60px)] bg-white border-r p-6 hidden md:block">
          <h2 className="text-xl font-semibold mb-4">Tài khoản</h2>
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium
                  ${pathname === tab.href ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                {tab.icon}
                {tab.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
