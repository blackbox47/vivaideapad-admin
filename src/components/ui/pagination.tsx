import * as React from 'react';
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';

function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
    />
  );
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn('flex items-center gap-1.5', className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<'li'>) {
  return <li data-slot="pagination-item" {...props} />;
}

export interface PaginationLinkProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
}

function PaginationLink({
  className,
  isActive,
  type = 'button',
  ...props
}: PaginationLinkProps) {
  return (
    <button
      type={type}
      aria-current={isActive ? 'page' : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        'size-8 rounded-lg text-xs flex items-center justify-center transition-colors cursor-pointer select-none',
        isActive
          ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
          : 'font-medium text-muted-foreground hover:bg-surface-subtle hover:text-foreground',
        className,
      )}
      {...props}
    />
  );
}

function PaginationPrevious({
  className,
  text = 'Previous',
  type = 'button',
  disabled,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { text?: string }) {
  return (
    <button
      type={type}
      aria-label="Go to previous page"
      disabled={disabled}
      className={cn(
        'inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition shadow-xs hover:bg-surface-subtle hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-card disabled:text-muted-foreground select-none cursor-pointer',
        className,
      )}
      {...props}
    >
      <ChevronLeftIcon className="size-3.5 stroke-2" />
      <span>{text}</span>
    </button>
  );
}

function PaginationNext({
  className,
  text = 'Next',
  type = 'button',
  disabled,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { text?: string }) {
  return (
    <button
      type={type}
      aria-label="Go to next page"
      disabled={disabled}
      className={cn(
        'inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition shadow-xs hover:bg-surface-subtle hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-card disabled:text-muted-foreground select-none cursor-pointer',
        className,
      )}
      {...props}
    >
      <span>{text}</span>
      <ChevronRightIcon className="size-3.5 stroke-2" />
    </button>
  );
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(
        'flex size-8 items-center justify-center text-muted-foreground select-none',
        className,
      )}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export interface TablePaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

/**
 * Generate visible page numbers and ellipses based on total pages and current page.
 */
function getPaginationRange(
  currentPage: number,
  totalPages: number,
): Array<number | 'ellipsis'> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, 'ellipsis', totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      'ellipsis',
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    'ellipsis',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    'ellipsis',
    totalPages,
  ];
}

/**
 * Production-grade table pagination footer matching Stitch reference design.
 */
function TablePagination({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [6, 10, 25, 50],
  className,
}: TablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem =
    totalItems === 0 ? 0 : ((currentPage - 1) * pageSize) + 1;
  const endItem = Math.min(totalItems, currentPage * pageSize);
  const paginationRange = getPaginationRange(currentPage, totalPages);

  return (
    <footer
      data-purpose="table-pagination"
      className={cn(
        'flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border-muted bg-surface-subtle/30 px-6 py-3.5 text-xs select-none',
        className,
      )}
    >
      {/* Left Information & Page Size Selector */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span>
          Showing{' '}
          <strong className="font-semibold text-foreground">
            {startItem}
          </strong>{' '}
          to{' '}
          <strong className="font-semibold text-foreground">
            {endItem}
          </strong>{' '}
          of{' '}
          <strong className="font-semibold text-foreground">
            {totalItems}
          </strong>{' '}
          entries
        </span>

        {onPageSizeChange ? (
          <>
            <div className="hidden h-4 w-px bg-border sm:block" />
            <div className="flex items-center gap-2">
              <label
                htmlFor="per-page-select"
                className="hidden text-muted-foreground sm:inline"
              >
                Rows per page:
              </label>
              <div className="relative">
                <select
                  id="per-page-select"
                  aria-label="Rows per page"
                  value={pageSize}
                  onChange={(e) => onPageSizeChange(Number(e.target.value))}
                  className="cursor-pointer appearance-none rounded-lg border border-border bg-card py-1 pl-2.5 pr-7 text-xs font-medium text-foreground transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {pageSizeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-muted-foreground">
                  <ChevronDownIcon className="size-3" />
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>

      {/* Right Controls: Buttons & Numeric Pages */}
      <div className="flex items-center gap-1.5">
        <PaginationPrevious
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        />

        <div className="flex items-center gap-1">
          {paginationRange.map((item, idx) => {
            if (item === 'ellipsis') {
              return <PaginationEllipsis key={`ellipsis-${idx}`} />;
            }

            const pageNum = item as number;
            return (
              <PaginationLink
                key={pageNum}
                isActive={pageNum === currentPage}
                onClick={() => onPageChange(pageNum)}
              >
                {pageNum}
              </PaginationLink>
            );
          })}
        </div>

        <PaginationNext
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        />
      </div>
    </footer>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  TablePagination,
};
