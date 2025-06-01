'use client';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react'; 
import { Sidebar } from '@/features/student/components/Sidebar';

export const MobileSidebarToggle = () => {
  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <Menu className="w-6 h-6" />
          </button>
        </SheetTrigger>

        <SheetContent side="left" className="p-0 w-[220px]">
            <Sidebar /> 
        </SheetContent>
      </Sheet>
    </div>
  );
};
