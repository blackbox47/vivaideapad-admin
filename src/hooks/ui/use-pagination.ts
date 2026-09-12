import { useMemo, useState } from 'react';
import type { TablePaginationProps } from '@/components/ui/pagination';

export interface UsePaginationOptions<T> {
  items: T[];
  initialPage?: number;
  initialPageSize?: number;
  pageSizeOptions?: number[];
}

export interface UsePaginationReturn<T> {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  paginatedItems: T[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  paginationProps: TablePaginationProps;
}

export function usePagination<T>({
  items,
  initialPage = 1,
  initialPageSize = 6,
  pageSizeOptions = [6, 10, 25, 50],
}: UsePaginationOptions<T>): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  // Derive safe page during render to avoid cascading renders in effects
  const safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages));

  const paginatedItems = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, safeCurrentPage, pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return {
    currentPage: safeCurrentPage,
    pageSize,
    totalItems,
    totalPages,
    paginatedItems,
    onPageChange: handlePageChange,
    onPageSizeChange: handlePageSizeChange,
    paginationProps: {
      currentPage: safeCurrentPage,
      pageSize,
      totalItems,
      onPageChange: handlePageChange,
      onPageSizeChange: handlePageSizeChange,
      pageSizeOptions,
    },
  };
}

export default usePagination;
