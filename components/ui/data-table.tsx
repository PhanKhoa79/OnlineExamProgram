"use client";

import React, { useState, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SkeletonLoadData } from './SkeletonLoadData';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageSize?: number;
  isLoading?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageSize = 7,
  isLoading,
}: DataTableProps<TData, TValue>) {
  // Router hooks for URL pagination
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // 1. Memoize columns & data to avoid unnecessary recalculation
  const memoColumns = useMemo(() => columns, [columns]);
  const memoData = useMemo(() => data, [data]);

  // 2. Initialize sorting & pagination state
  const [sorting, setSorting] = useState<SortingState>([]);
  const initialPage = Math.max(0, (Number(searchParams.get('page')) || 1) - 1);
  const [pagination, setPagination] = useState({ pageIndex: initialPage, pageSize });

  // 3. Create table instance
  const table = useReactTable({
    data: memoData,
    columns: memoColumns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === 'function' ? updater(pagination) : updater;
      setPagination(newState);
      // Sync page param in URL
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      params.set('page', String(newState.pageIndex + 1));
      router.replace(`${pathname}?${params.toString()}`);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination },
  });

  const { pageIndex, pageSize: currentSize } = table.getState().pagination;
  const totalPages = table.getPageCount();
  const firstRow = pageIndex * currentSize + 1;
  const lastRow = Math.min((pageIndex + 1) * currentSize, memoData.length);

  // 4. Compute pagination range with ellipsis
  const paginationRange = useMemo<(number | string)[]>(() => {
    const maxButtons = 5;
    if (totalPages <= maxButtons) return Array.from({ length: totalPages }, (_, i) => i);
    const siblings = 1;
    const left = Math.max(pageIndex - siblings, 1);
    const right = Math.min(pageIndex + siblings, totalPages - 2);
    const showLeftDots = left > 2;
    const showRightDots = right < totalPages - 3;
    const pages: (number | string)[] = [];
    pages.push(0);
    if (showLeftDots) pages.push('...');
    else Array.from({ length: left - 1 }, (_, i) => pages.push(i + 1));
    for (let i = left; i <= right; i++) pages.push(i);
    if (showRightDots) pages.push('...');
    else Array.from({ length: totalPages - 2 - right }, (_, i) => pages.push(right + 1 + i));
    pages.push(totalPages - 1);
    return pages;
  }, [pageIndex, totalPages]);

  return (
    <>
      { isLoading ? 
        (
          <SkeletonLoadData />
        ) : (
        <div className="max-w-screen overflow-x-auto rounded border">
          <Table className="w-full min-w-[800px] text-sm text-left">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={memoColumns.length} className="h-24 text-center">
                      No data.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Pagination Controls */}
      <div className="flex flex-col items-end gap-4 lg:items-center lg:justify-between lg:flex-row py-4 text-sm cursor-pointer">
        <span>
          Showing {firstRow}-{lastRow} of {memoData.length}
        </span>
        <div className="flex items-center space-x-1 cursor-pointer">
          <Button
            size="sm"
            type="button"
            variant="outline"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {paginationRange.map((item, idx) =>
            typeof item === 'string' ? (
              <span key={idx} className="px-2 select-none">
                …
              </span>
            ) : (
              <Button
                key={item}
                type="button"
                size="sm"
                variant={item === pageIndex ? 'secondary' : 'outline'}
                onClick={() => table.setPageIndex(item as number)}
                className="cursor-pointer"
              >
                {item + 1}
              </Button>
            )
          )}
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}
