import { isNewData } from "@/lib/dateUtils";

interface NewDataBadgeProps {
  createdAt: string;
  className?: string;
}

/**
 * Component for displaying "New" badge for recent data
 * @param createdAt - The creation date string
 * @param className - Additional CSS classes
 * @returns JSX element or null if data is not new
 */
export const NewDataBadge = ({ createdAt, className = "" }: NewDataBadgeProps) => {
  if (!isNewData(createdAt)) return null;
  
  return (
    <span 
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200 ml-2 ${className}`}
      title={`Được tạo vào: ${new Date(createdAt).toLocaleString('vi-VN')}`}
    >
      Mới
    </span>
  );
}; 