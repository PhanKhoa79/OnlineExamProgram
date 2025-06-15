'use client';

import Link from 'next/link';
import { KeyboardArrowDown } from '@mui/icons-material';
import { ReactNode, useState } from 'react';
import { useResponsive } from '@/hooks/useReponsiveHook';
import { useNavigationLoading } from '@/hooks/useNavigationLoading';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
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
  const { isLoading, loadingRoute, navigateWithLoading } = useNavigationLoading();
  const showTitle = (isMobile || isTablet) ? openMenu : !collapsed;
  const pathname = usePathname();
  const isActive = pathname.startsWith(href ?? '#');
  const isNavigating = isLoading && loadingRoute === href;

  const handleToggle = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault();
      setOpen(!open);
    } else {
      e.preventDefault();
      navigateWithLoading(href);
    }
  };

  return (
    <div className="group/item">
      <Link
        href={href}
        onClick={handleToggle}
        prefetch={true}
        className={classNames(
          "relative flex items-center w-full text-sm font-medium rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden group",
          {
            // Collapsed state - center content
            "justify-center px-2 py-3": collapsed && !(isMobile || isTablet),
            // Normal state - space between
            "justify-between px-4 py-3": !collapsed || (isMobile || isTablet),
            // Active state with glass morphism
            "bg-gradient-to-r from-indigo-500/90 to-purple-600/90 text-white shadow-lg shadow-indigo-500/25 dark:shadow-purple-500/25 backdrop-blur-xl border border-white/20": isActive,
            // Hover state 
            "hover:bg-white/60 dark:hover:bg-white/10 hover:backdrop-blur-xl hover:border hover:border-white/30 dark:hover:border-gray-600/30 hover:shadow-lg hover:shadow-indigo-500/10 dark:hover:shadow-purple-500/10 hover:-translate-y-0.5": !isActive,
            // Default state
            "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white": !isActive,
          }
        )}
      >
        {/* Background gradient overlay */}
        <div className={classNames(
          "absolute inset-0 rounded-2xl transition-all duration-500 opacity-0 group-hover:opacity-100",
          {
            "opacity-100": isActive,
            "bg-gradient-to-r from-indigo-500/10 to-purple-600/10 dark:from-indigo-400/20 dark:to-purple-400/20": !isActive
          }
        )}></div>

        {/* Content Container */}
        <div className={classNames(
          "relative z-10 flex items-center font-medium",
          {
            // When collapsed (desktop only), center the icon
            "justify-center": collapsed && !(isMobile || isTablet),
            // When not collapsed, normal layout with gap
            "gap-4": !collapsed || (isMobile || isTablet)
          }
        )}>
          {icon && (
            <div className={classNames(
              "flex items-center justify-center rounded-xl transition-all duration-300 relative",
              {
                // Collapsed state - larger icon container
                "w-10 h-10": collapsed && !(isMobile || isTablet),
                // Normal state - smaller icon container
                "w-8 h-8": !collapsed || (isMobile || isTablet),
                // Active state styling
                "bg-white/20 text-white": isActive,
                // Inactive state styling
                "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/50 group-hover:scale-110": !isActive
              }
            )}>
              {isNavigating ? (
                <LoadingSpinner size="sm" color={isActive ? "white" : "primary"} />
              ) : (
                icon
              )}
            </div>
          )}
          
          {showTitle && (
            <span className={classNames(
              "transition-all duration-300 font-medium",
              {
                "text-white font-semibold": isActive,
                "text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white": !isActive
              }
            )}>
              {title}
            </span>
          )}
        </div>

        {/* Dropdown Arrow - only show when not collapsed */}
        {hasChildren && !collapsed && showTitle && (
          <KeyboardArrowDown
            className={classNames(
              'relative z-10 w-5 h-5 transition-all duration-300',
              {
                'rotate-180': open,
                'text-white': isActive,
                'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200': !isActive
              }
            )}
          />
        )}

        {/* Active indicator */}
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full opacity-80"></div>
        )}

        {/* Tooltip for collapsed state */}
        {collapsed && !(isMobile || isTablet) && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            {title}
          </div>
        )}
      </Link>

      {hasChildren && open && !collapsed && (
        <div className="ml-8 mt-2 space-y-2 text-sm animate-fadeIn">
          <div className="border-l-2 border-gray-200 dark:border-gray-700 pl-4">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};
