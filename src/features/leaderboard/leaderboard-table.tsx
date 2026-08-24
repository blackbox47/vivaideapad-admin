import {
  ProjectTable,
  ProjectTableCell,
  ProjectTableRow,
} from '@/components/ui/project-table';
import StatusBadge from '@/components/shared/status-badge';
import { formatPoints } from '@/hooks/leaderboard/use-leaderboard';
import type { LeaderboardEntry } from '@/models/leaderboard/leaderboard-model';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
}

export default function LeaderboardTable({ entries }: LeaderboardTableProps) {
  return (
    <ProjectTable
      columns={[
        { label: 'Rank' },
        { label: 'Contributor' },
        { label: 'Approved ideas', align: 'right' },
        { label: 'Points', align: 'right' },
        { label: 'Visibility' },
      ]}
    >
      {entries.map((entry) => (
        <ProjectTableRow key={entry.id}>
          <ProjectTableCell className="font-semibold text-foreground">
            #{entry.rank}
          </ProjectTableCell>
          <ProjectTableCell>
            <strong className="font-semibold text-foreground">
              {entry.name}
            </strong>
          </ProjectTableCell>
          <ProjectTableCell align="right" className="text-[#687773]">
            {entry.approvedIdeas}
          </ProjectTableCell>
          <ProjectTableCell align="right" className="font-semibold text-foreground">
            {formatPoints(entry.points)}
          </ProjectTableCell>
          <ProjectTableCell>
            <StatusBadge status={entry.visibility} />
          </ProjectTableCell>
        </ProjectTableRow>
      ))}
    </ProjectTable>
  );
}