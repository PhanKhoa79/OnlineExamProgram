'use client';

import Link from 'next/link';
import { KeyboardArrowDown } from '@mui/icons-material';
import { ReactNode, useState } from 'react';
import { useResponsive } from '@/hooks/useReponsiveHook';
import classNames from 'classnames';
import { usePathname } from 'next/navigation'; 

interface SidebarItemProps {
  title: string;
  icon?: ReactNode;
  children?: ReactNode;
  isOpenDefault?: boolean;
  collapsed?: boolean;
  openMenu?: boolean;
  href?: string;
}

export const SidebarItem = ({
  title,
  icon,
  children,
  isOpenDefault = false,
  collapsed = false,
  openMenu = false,
  href = '#',
}: SidebarItemProps) => {
  const [open, setOpen] = useState(isOpenDefault);
  const hasChildren = !!children;
  const { isMobile, isTablet } = useResponsive();
  const showTitle = (isMobile || isTablet) ? openMenu : !collapsed;
  const pathname = usePathname(); // ✅ Get current path
  const isActive = pathname.startsWith(href ?? '#');

  const handleToggle = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault();
      setOpen(!open);
    }
  };

  return (
    <div>
      <Link
        href={href}
        onClick={handleToggle}
        className={classNames(
          "flex items-center justify-between w-full px-3 py-2 text-base rounded-xl cursor-pointer dark:text-white",
          {
            "bg-indigo-600 dark:bg-sky-400 text-white": isActive,
            "hover:bg-indigo-600 dark:hover:bg-sky-400 hover:text-white": !isActive,
          }
        )}
      >
        <span className="flex items-center gap-4 font-normal">
          {icon}
          {showTitle && title}
        </span>
        {hasChildren && !collapsed && (
          <KeyboardArrowDown
            className={classNames('w-4 h-4 transition-transform', {
              'rotate-180': open,
            })}
          />
        )}
      </Link>

      {hasChildren && open && !collapsed && (
        <div className="ml-6 mt-1 space-y-1 text-sm text-gray-500">
          {children}
        </div>
      )}
    </div>
  );
};
