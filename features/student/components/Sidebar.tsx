'use client';

import Link from 'next/link';
import { Home, Info, Book, Mail } from 'lucide-react';

const menuItems = [
  { label: 'Home', href: '/home', icon: <Home className="w-5 h-5" /> },
  { label: 'About', href: '/about', icon: <Info className="w-5 h-5" /> },
  { label: 'Resources', href: '/resources', icon: <Book className="w-5 h-5" /> },
  { label: 'Contact', href: '/contact', icon: <Mail className="w-5 h-5" /> },
];

export const Sidebar = ({ className = '' }: { className?: string }) => {
  return (
    <aside className={`w-[220px] p-4 bg-white dark:bg-[#1f1f2e] border-r border-gray-200 dark:border-gray-700 ${className}`}>
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-[#2a2a3f]"
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};
