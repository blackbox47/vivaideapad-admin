import React, { useCallback, useEffect, useRef, useState } from 'react';

import { EmptyState } from '@/components/shared/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

/**
 * Reusable table shell matching the project design language:
 *  - rounded-[18px] card, hairline border (border-border)
 *  - muted (bg-surface-subtle) header with 11-12px uppercase-style muted label cells
 *  - hairline (border-border-muted) row dividers, 18px horizontal cell padding, 14px vertical
 *  - 1st and last columns pinned (sticky) to the screen/container edges by default
 *  - inner columns scrollable horizontally underneath pinned columns
 *  - dynamic elevation shadows indicating scrolled overflow content
 */

const SHELL_CLASS =
  'relative rounded-[18px] border border-border bg-card overflow-hidden';

const INNER_BASE =
  'w-full border-separate border-spacing-0 text-left [&_th]:border-b [&_th]:border-border-muted [&_td]:border-b [&_td]:border-border-muted [&_tr:last-child_td]:border-b-0';

const HEADER_CELL_BASE =
  'px-[18px] py-3.5 font-medium text-xs text-muted-foreground bg-surface-subtle align-middle';

const ROW_BASE =
  'group border-t border-border-muted transition-colors hover:bg-surface-subtle/60';

const CELL_BASE = 'px-[18px] py-3.5 align-middle bg-card';

export interface ProjectTableColumn {
  /** Header label. Optional for action columns. */
  label?: React.ReactNode;
  /** Right-align numeric / status cells. */
  align?: 'left' | 'right' | 'center';
  /** Optional extra utility classes appended to the header `<th>`. */
  headerClassName?: string;
  /** Set to `true` for the trailing action column (renders an empty header). */
  isAction?: boolean;
}

export interface ProjectTableProps {
  columns: ProjectTableColumn[];
  /** Number of placeholder rows shown while `isLoading`. */
  loadingRows?: number;
  /** Whether to render skeleton rows. */
  isLoading?: boolean;
  /** When true, renders an empty state row across all columns. */
  isEmpty?: boolean;
  /** Title for empty state when isEmpty is true. */
  emptyTitle?: React.ReactNode;
  /** Description for empty state when isEmpty is true. */
  emptyDescription?: React.ReactNode;
  /** Action for empty state when isEmpty is true. */
  emptyAction?: React.ReactNode;
  /** Optional className applied to the outer shell wrapper. */
  className?: string;
  /** Min-width utility class for horizontal scrolling (defaults to 'min-w-[800px]'). */
  minWidth?: string;
  /** Whether to pin 1st and last columns (defaults to true when >= 3 columns). */
  pinColumns?: boolean;
  children?: React.ReactNode;
}

function alignClass(align: ProjectTableColumn['align']) {
  if (align === 'right') {
    return 'text-right';
  }
  if (align === 'center') {
    return 'text-center';
  }
  return 'text-left';
}

function ProjectTable({
  columns,
  isLoading = false,
  loadingRows = 6,
  isEmpty = false,
  emptyTitle,
  emptyDescription,
  emptyAction,
  className,
  minWidth = 'min-w-[800px]',
  pinColumns = true,
  children,
}: ProjectTableProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const shouldPin = pinColumns && columns.length > 2;

  const updateScrollState = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    // Pinned left column shows elevation shadow when scrolled to the right
    setCanScrollLeft(scrollLeft > 2);
    // Pinned right column shows elevation shadow when more scrollable content exists to the right
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 2);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState, { passive: true });

    const observer =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => updateScrollState())
        : null;

    observer?.observe(el);
    if (el.firstElementChild) {
      observer?.observe(el.firstElementChild);
    }

    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
      observer?.disconnect();
    };
  }, [updateScrollState, columns, isLoading, isEmpty, children]);

  const pinnedContainerClasses = shouldPin
    ? cn(
        // Pinned first column (left: 0)
        '[&_th:first-child]:sticky [&_th:first-child]:left-0 [&_th:first-child]:z-20 [&_th:first-child]:bg-surface-subtle',
        '[&_td:first-child:not([colspan])]:sticky [&_td:first-child:not([colspan])]:left-0 [&_td:first-child:not([colspan])]:z-10 [&_td:first-child:not([colspan])]:bg-card',
        canScrollLeft
          ? '[&_th:first-child]:shadow-[1px_0_0_0_var(--border-muted),4px_0_12px_-2px_rgba(0,0,0,0.08)] dark:[&_th:first-child]:shadow-[1px_0_0_0_var(--border-muted),4px_0_12px_-2px_rgba(0,0,0,0.4)] [&_td:first-child:not([colspan])]:shadow-[1px_0_0_0_var(--border-muted),4px_0_12px_-2px_rgba(0,0,0,0.08)] dark:[&_td:first-child:not([colspan])]:shadow-[1px_0_0_0_var(--border-muted),4px_0_12px_-2px_rgba(0,0,0,0.4)]'
          : '[&_th:first-child]:shadow-[1px_0_0_0_var(--border-muted)] [&_td:first-child:not([colspan])]:shadow-[1px_0_0_0_var(--border-muted)]',

        // Pinned last column (right: 0)
        '[&_th:last-child]:sticky [&_th:last-child]:right-0 [&_th:last-child]:z-20 [&_th:last-child]:bg-surface-subtle',
        '[&_td:last-child:not([colspan])]:sticky [&_td:last-child:not([colspan])]:right-0 [&_td:last-child:not([colspan])]:z-10 [&_td:last-child:not([colspan])]:bg-card',
        canScrollRight
          ? '[&_th:last-child]:shadow-[-1px_0_0_0_var(--border-muted),-4px_0_12px_-2px_rgba(0,0,0,0.08)] dark:[&_th:last-child]:shadow-[-1px_0_0_0_var(--border-muted),-4px_0_12px_-2px_rgba(0,0,0,0.4)] [&_td:last-child:not([colspan])]:shadow-[-1px_0_0_0_var(--border-muted),-4px_0_12px_-2px_rgba(0,0,0,0.08)] dark:[&_td:last-child:not([colspan])]:shadow-[-1px_0_0_0_var(--border-muted),-4px_0_12px_-2px_rgba(0,0,0,0.4)]'
          : '[&_th:last-child]:shadow-[-1px_0_0_0_var(--border-muted)] [&_td:last-child:not([colspan])]:shadow-[-1px_0_0_0_var(--border-muted)]',

        // Row hover synchronization for pinned cells
        '[&_tr:hover_td:first-child:not([colspan])]:bg-surface-subtle/60',
        '[&_tr:hover_td:last-child:not([colspan])]:bg-surface-subtle/60',
      )
    : '';

  return (
    <div className={cn(SHELL_CLASS, className)}>
      <Table
        containerRef={scrollContainerRef}
        containerClassName="no-scrollbar"
        className={cn(INNER_BASE, minWidth, pinnedContainerClasses)}
      >
        <TableHeader>
          <TableRow className="border-0 hover:bg-transparent">
            {columns.map((column, index) => (
              <TableHead
                key={index}
                className={cn(
                  HEADER_CELL_BASE,
                  alignClass(column.align),
                  column.headerClassName,
                )}
              >
                {column.isAction ? '' : column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: loadingRows }).map((_, index) => (
              <TableRow
                key={`skeleton-${index}`}
                className={cn(ROW_BASE, 'pointer-events-none')}
              >
                {columns.map((_, colIndex) => {
                  const isFirst = colIndex === 0;
                  const isLast = colIndex === columns.length - 1;
                  return (
                    <TableCell
                      key={colIndex}
                      className={cn(
                        CELL_BASE,
                        'h-12',
                        shouldPin && isFirst && 'sticky left-0 z-10',
                        shouldPin &&
                          isFirst &&
                          (canScrollLeft
                            ? 'shadow-[1px_0_0_0_var(--border-muted),4px_0_12px_-2px_rgba(0,0,0,0.08)] dark:shadow-[1px_0_0_0_var(--border-muted),4px_0_12px_-2px_rgba(0,0,0,0.4)]'
                            : 'shadow-[1px_0_0_0_var(--border-muted)]'),
                        shouldPin && isLast && 'sticky right-0 z-10',
                        shouldPin &&
                          isLast &&
                          (canScrollRight
                            ? 'shadow-[-1px_0_0_0_var(--border-muted),-4px_0_12px_-2px_rgba(0,0,0,0.08)] dark:shadow-[-1px_0_0_0_var(--border-muted),-4px_0_12px_-2px_rgba(0,0,0,0.4)]'
                            : 'shadow-[-1px_0_0_0_var(--border-muted)]'),
                      )}
                    >
                      <Skeleton className="h-4 w-4/5" />
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : isEmpty ? (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={columns.length}
                className="p-0 border-0 static"
              >
                <EmptyState
                  card={false}
                  size="md"
                  title={emptyTitle}
                  description={emptyDescription}
                  action={emptyAction}
                />
              </TableCell>
            </TableRow>
          ) : (
            children
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export interface ProjectTableRowProps
  extends React.ComponentProps<typeof TableRow> {
  className?: string;
}

function ProjectTableRow({ className, ...props }: ProjectTableRowProps) {
  return <TableRow className={cn(ROW_BASE, className)} {...props} />;
}

export interface ProjectTableCellProps
  extends React.ComponentProps<typeof TableCell> {
  /** Right-align numeric / status cells. */
  align?: 'left' | 'right' | 'center';
  className?: string;
}

function ProjectTableCell({
  align,
  className,
  ...props
}: ProjectTableCellProps) {
  return (
    <TableCell
      className={cn(CELL_BASE, alignClass(align), className)}
      {...props}
    />
  );
}

export {
  ProjectTable,
  ProjectTableRow,
  ProjectTableCell,
};