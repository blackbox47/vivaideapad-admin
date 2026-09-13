import StatusBadge from '@/components/shared/status-badge';
import TableActions from '@/components/shared/table-actions';
import { Button } from '@/components/ui/button';
import {
  ProjectTable,
  ProjectTableCell,
  ProjectTableRow,
} from '@/components/ui/project-table';
import usePagination from '@/hooks/ui/use-pagination';
import type { MyIdea } from '@/models/creator/my-ideas-model';
import { formatDisplayDate } from '@/utils/helpers/format-display-date';

interface MyIdeasTableProps {
  items: MyIdea[];
  isLoading: boolean;
  onView: (idea: MyIdea) => void;
  pageSize?: number;
  showPagination?: boolean;
  className?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  loadingRows?: number;
  pinColumns?: boolean;
  minWidth?: string;
  compact?: boolean;
}

const COLUMNS = [
  { label: 'Title' },
  { label: 'Concept' },
  { label: 'Date' },
  { label: 'Status' },
  { label: 'Reward' },
  { isAction: true },
];

const COMPACT_COLUMNS = [
  { label: 'Title' },
  { label: 'Status' },
  { label: 'Reward' },
  { isAction: true },
];

export default function MyIdeasTable({
  items,
  isLoading,
  onView,
  pageSize = 6,
  showPagination = true,
  className,
  emptyTitle = 'No submissions yet',
  emptyDescription = 'Submit your first idea from the available briefs.',
  loadingRows = 4,
  pinColumns,
  minWidth,
  compact = false,
}: MyIdeasTableProps) {
  const { paginatedItems, paginationProps } = usePagination({
    items,
    initialPageSize: pageSize,
  });

  return (
    <ProjectTable
      columns={compact ? COMPACT_COLUMNS : COLUMNS}
      isLoading={isLoading}
      loadingRows={loadingRows}
      isEmpty={items.length === 0}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
      pagination={showPagination ? paginationProps : null}
      className={className}
      pinColumns={pinColumns}
      minWidth={minWidth}
    >
      {paginatedItems.map((idea) => (
        <ProjectTableRow key={idea.id}>
          <ProjectTableCell className="min-w-0">
            <strong className="block truncate font-semibold text-foreground">
              {idea.title}
            </strong>
          </ProjectTableCell>
          {compact ? null : (
            <>
              <ProjectTableCell className="text-muted-foreground">
                {idea.conceptTitle ?? idea.topic ?? '—'}
              </ProjectTableCell>
              <ProjectTableCell className="whitespace-nowrap text-muted-foreground">
                {formatDisplayDate(idea.submitted)}
              </ProjectTableCell>
            </>
          )}
          <ProjectTableCell className="whitespace-nowrap">
            <StatusBadge status={idea.status} />
          </ProjectTableCell>
          <ProjectTableCell className="whitespace-nowrap">
            <strong className="font-semibold text-foreground">{idea.reward}</strong>
          </ProjectTableCell>
          <ProjectTableCell className="whitespace-nowrap">
            <TableActions>
              <Button
                type="button"
                variant="outline"
                onClick={() => onView(idea)}
                className="h-auto rounded-full border-border bg-card px-3.5 py-1.5 text-xs font-bold text-foreground hover:bg-surface-subtle"
              >
                View
              </Button>
            </TableActions>
          </ProjectTableCell>
        </ProjectTableRow>
      ))}
    </ProjectTable>
  );
}
