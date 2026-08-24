import type { ReactNode } from 'react';

import {
  ProjectTable,
  type ProjectTableColumn,
} from '@/components/ui/project-table';

interface PeopleTableProps {
  columns: string[];
  children: ReactNode;
}

/**
 * Thin wrapper around the shared `ProjectTable` that accepts the legacy
 * `string[]` columns API used by the people feature. Each empty-string column
 * entry is treated as an action column (no header label).
 */
export default function PeopleTable({ columns, children }: PeopleTableProps) {
  const projectColumns: ProjectTableColumn[] = columns.map((label) =>
    label === ''
      ? { label: '', isAction: true }
      : { label },
  );

  return <ProjectTable columns={projectColumns}>{children}</ProjectTable>;
}