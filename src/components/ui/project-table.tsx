import * as React from 'react';

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
 *  - rounded-[18px] white card, hairline border (#dfe7e3)
 *  - muted (#f6f8f5) header with 11-12px uppercase-style muted label cells
 *  - hairline (#eef1ef) row dividers, 18px horizontal cell padding, 14px vertical
 *  - inner table has a min-width for horizontal scroll, full-width on overflow
 *
 * Use `columns` to define the header labels. Pass the row content as children
 * (one or more <ProjectTableRow> children, or any <tr> elements). For cells
 * inside rows, use <ProjectTableCell> for the default 18/14 padding.
 */

const SHELL_CLASS =
  'overflow-x-auto rounded-[18px] border border-[#dfe7e3] bg-white';
const INNER_CLASS = 'w-full min-w-[720px] border-collapse text-left';

const HEADER_CELL_BASE =
  'px-[18px] py-3.5 font-medium text-xs text-[#687773] bg-[#f6f8f5]';

const ROW_BASE = 'border-t border-[#eef1ef] hover:bg-transparent';

const CELL_BASE = 'px-[18px] py-3.5';

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

interface ProjectTableProps {
  columns: ProjectTableColumn[];
  /** Number of placeholder rows shown while `isLoading`. */
  loadingRows?: number;
  /** Whether to render skeleton rows. */
  isLoading?: boolean;
  /** Optional className applied to the outer shell wrapper. */
  className?: string;
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
  className,
  children,
}: ProjectTableProps) {
  return (
    <div className={cn(SHELL_CLASS, className)}>
      <Table className={INNER_CLASS}>
        <TableHeader>
          <TableRow className="border-0">
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
                {columns.map((_, colIndex) => (
                  <TableCell
                    key={colIndex}
                    className={cn(CELL_BASE, 'h-12')}
                  />
                ))}
              </TableRow>
            ))
          ) : (
            children
          )}
        </TableBody>
      </Table>
    </div>
  );
}

interface ProjectTableRowProps extends React.ComponentProps<typeof TableRow> {
  className?: string;
}

function ProjectTableRow({ className, ...props }: ProjectTableRowProps) {
  return <TableRow className={cn(ROW_BASE, className)} {...props} />;
}

interface ProjectTableCellProps
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
  type ProjectTableProps,
  type ProjectTableRowProps,
  type ProjectTableCellProps,
};