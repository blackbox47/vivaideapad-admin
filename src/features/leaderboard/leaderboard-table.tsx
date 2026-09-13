import {
  ProjectTable,
  ProjectTableCell,
  ProjectTableRow,
} from '@/components/ui/project-table';
import StatusBadge from '@/components/shared/status-badge';
import { formatPoints } from '@/hooks/leaderboard/use-leaderboard';
import usePagination from '@/hooks/ui/use-pagination';
import type { LeaderboardEntry } from '@/models/leaderboard/leaderboard-model';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
}

export default function LeaderboardTable({ entries }: LeaderboardTableProps) {
  const { paginatedItems, paginationProps } = usePagination({
    items: entries,
    initialPageSize: 6,
  });

  return (
    <ProjectTable
      pagination={paginationProps}
      columns={[
        { label: 'Rank' },
        { label: 'Contributor' },
        { label: 'Approved ideas', align: 'right' },
        { label: 'Amount', align: 'right' },
        { label: 'Visibility', align: 'right' },
      ]}
      isEmpty={entries.length === 0}
      emptyTitle="No additional standings"
      emptyDescription="All ranked contributors are currently displayed on the podium above."
    >
      {paginatedItems.map((entry) => (
        <ProjectTableRow key={entry.id}>
          <ProjectTableCell className="font-semibold text-foreground">
            #{entry.rank}
          </ProjectTableCell>
          <ProjectTableCell>
            <strong className="font-semibold text-foreground">
              {entry.name}
            </strong>
          </ProjectTableCell>
          <ProjectTableCell align="right" className="text-muted-foreground">
            {entry.approvedIdeas}
          </ProjectTableCell>
          <ProjectTableCell align="right" className="font-semibold text-foreground">
            {formatPoints(entry.points)}
          </ProjectTableCell>
          <ProjectTableCell align="right">
            <StatusBadge status={entry.visibility} />
          </ProjectTableCell>
        </ProjectTableRow>
      ))}
    </ProjectTable>
  );
}