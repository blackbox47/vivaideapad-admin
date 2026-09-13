import type { ReactNode } from 'react';

import {
  ProjectTable,
  type ProjectTableColumn,
  type TablePaginationProps,
} from '@/components/ui/project-table';

export interface PeopleTableProps {
  columns: Array<string | ProjectTableColumn>;
  minWidth?: string;
  pinColumns?: boolean;
  pagination?: TablePaginationProps;
  className?: string;
  children: ReactNode;
}

/**
 * Responsive table shell for people lists (Applicants, Invited, Contributors).
 * Defaults to `min-w-[640px]` with smooth horizontal scrolling matching Stitch mobile design.
 */
export default function PeopleTable({
  columns,
  minWidth = 'min-w-[640px]',
  pinColumns = false,
  pagination,
  className,
  children,
}: PeopleTableProps) {
  const projectColumns: ProjectTableColumn[] = columns.map((col) => {
    if (typeof col === 'string') {
      return col === '' ? { label: '', isAction: true } : { label: col };
    }
    return col;
  });

  return (
    <ProjectTable
      columns={projectColumns}
      minWidth={minWidth}
      pinColumns={pinColumns}
      pagination={pagination}
      className={className}
    >
      {children}
    </ProjectTable>
  );
}