import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ExamResultsPaginationProps {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  limit: number;
  loading: boolean;
  onPageChange: (page: number) => void;
}

const ExamResultsPagination: React.FC<ExamResultsPaginationProps> = ({
  currentPage,
  totalPages,
  totalResults,
  limit,
  loading,
  onPageChange
}) => {
  if (totalPages <= 1) return null;

  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-700">
              Hiển thị <span className="font-medium">{((currentPage - 1) * limit) + 1}</span> đến{' '}
              <span className="font-medium">{Math.min(currentPage * limit, totalResults)}</span> của{' '}
              <span className="font-medium">{totalResults}</span> kết quả
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="h-9 px-3"
            >
              <ChevronLeft className="h-4 w-4" />
              Trước
            </Button>

            <div className="flex items-center gap-1">
              {(() => {
                const maxPages = 5;
                
                // Calculate start and end page
                let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
                const endPage = Math.min(totalPages, startPage + maxPages - 1);
                
                // Adjust start page if we're near the end to always show maxPages when possible
                if (endPage - startPage + 1 < maxPages && totalPages >= maxPages) {
                  startPage = Math.max(1, endPage - maxPages + 1);
                }
                
                const pages = [];
                
                // Add ellipsis and first page if needed
                if (startPage > 1) {
                  pages.push(
                    <Button
                      key={1}
                      variant="outline"
                      size="sm"
                      onClick={() => onPageChange(1)}
                      disabled={loading}
                      className="h-9 w-9"
                    >
                      1
                    </Button>
                  );
                  
                  if (startPage > 2) {
                    pages.push(
                      <span key="start-ellipsis" className="px-2 text-gray-400">
                        ...
                      </span>
                    );
                  }
                }
                
                // Add page numbers
                for (let i = startPage; i <= endPage; i++) {
                  pages.push(
                    <Button
                      key={i}
                      variant={i === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => onPageChange(i)}
                      disabled={loading}
                      className="h-9 w-9 cursor-pointer"
                    >
                      {i}
                    </Button>
                  );
                }
                
                // Add ellipsis and last page if needed
                if (endPage < totalPages) {
                  if (endPage < totalPages - 1) {
                    pages.push(
                      <span key="end-ellipsis" className="px-2 text-gray-400">
                        ...
                      </span>
                    );
                  }
                  
                  pages.push(
                    <Button
                      key={totalPages}
                      variant="outline"
                      size="sm"
                      onClick={() => onPageChange(totalPages)}
                      disabled={loading}
                      className="h-9 w-9 cursor-pointer"
                    >
                      {totalPages}
                    </Button>
                  );
                }
                
                return pages;
              })()}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              className="h-9 px-3 cursor-pointer"
            >
              Sau
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExamResultsPagination; 