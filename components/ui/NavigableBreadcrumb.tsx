import React from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbItemType {
  label: string;
  href?: string;
  isHome?: boolean;
  isActive?: boolean;
}

interface NavigableBreadcrumbProps {
  items: BreadcrumbItemType[];
  variant?: 'default' | 'compact';
  showDescription?: boolean;
}

export const NavigableBreadcrumb: React.FC<NavigableBreadcrumbProps> = ({ 
  items, 
  variant = 'default',
  showDescription = true 
}) => {
  const router = useRouter();

  const handleNavigate = (href: string) => {
    router.push(href);
  };

  if (variant === 'compact') {
    return (
      <nav aria-label="Breadcrumb navigation" className="mb-4">
        <Breadcrumb>
          <BreadcrumbList className="flex items-center space-x-1">
            {items.map((item, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  {item.isActive ? (
                    <BreadcrumbPage 
                      className="text-blue-600 dark:text-blue-400 font-medium text-sm"
                      aria-current="page"
                    >
                      {item.label}
                    </BreadcrumbPage>
                  ) : (
                    <button
                      onClick={() => item.href && handleNavigate(item.href)}
                      className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded"
                      type="button"
                      disabled={!item.href}
                      aria-label={`Navigate to ${item.label}`}
                    >
                      {item.isHome ? <Home className="h-3 w-3" aria-hidden="true" /> : item.label}
                    </button>
                  )}
                </BreadcrumbItem>
                {index < items.length - 1 && (
                  <BreadcrumbSeparator aria-hidden="true">
                    <ChevronRight className="h-3 w-3 text-gray-300 dark:text-gray-600" />
                  </BreadcrumbSeparator>
                )}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </nav>
    );
  }

  return (
    <nav aria-label="Breadcrumb navigation" className="breadcrumb-container">
      <Breadcrumb>
        <BreadcrumbList className="flex items-center space-x-1 flex-wrap">
          {items.map((item, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem className="flex items-center">
                {item.isActive ? (
                  <BreadcrumbPage 
                    className="breadcrumb-active"
                    aria-current="page"
                  >
                    {item.isHome && <Home className="h-4 w-4 flex-shrink-0" aria-hidden="true" />}
                    <span className="text-sm break-words">{item.label}</span>
                  </BreadcrumbPage>
                ) : (
                  <button
                    onClick={() => item.href && handleNavigate(item.href)}
                    className="breadcrumb-button"
                    type="button"
                    disabled={!item.href}
                    aria-label={`Navigate to ${item.label}`}
                  >
                    {item.isHome && <Home className="h-4 w-4 flex-shrink-0" aria-hidden="true" />}
                    <span className="break-words">{item.label}</span>
                  </button>
                )}
              </BreadcrumbItem>
              {index < items.length - 1 && (
                <BreadcrumbSeparator className="breadcrumb-separator" aria-hidden="true">
                  <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      
      {/* Optional: Breadcrumb description */}
      {showDescription && (
        <div className="breadcrumb-description" role="status" aria-live="polite">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="hidden sm:inline" aria-hidden="true">📍 Vị trí hiện tại:</span>
            <span className="font-medium text-gray-600 dark:text-gray-300">
              {items.map(item => item.label).join(' › ')}
            </span>
          </div>
        </div>
      )}
    </nav>
  );
}; 