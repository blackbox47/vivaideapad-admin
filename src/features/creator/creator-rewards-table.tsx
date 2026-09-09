import StatusBadge from '@/components/shared/status-badge';
import {
  ProjectTable,
  ProjectTableCell,
  ProjectTableRow,
  type ProjectTableColumn,
} from '@/components/ui/project-table';
import type { CreatorRewardEntry } from '@/models/creator/creator-rewards-model';

interface CreatorRewardsTableProps {
  entries: CreatorRewardEntry[];
  isLoading: boolean;
}

const columns: ProjectTableColumn[] = [
  { label: 'Date' },
  { label: 'Description' },
  { label: 'Type' },
  { label: 'Status' },
  { label: 'Amount', align: 'right' },
];

export default function CreatorRewardsTable({
  entries,
  isLoading,
}: CreatorRewardsTableProps) {
  return (
    <ProjectTable
      columns={columns}
      isLoading={isLoading}
      loadingRows={4}
      isEmpty={entries.length === 0}
      emptyTitle="No transactions yet"
      emptyDescription="Your reward earnings and payouts will appear here."
      className="border-0 rounded-[14px]"
      minWidth="min-w-[700px]"
    >
      {entries.map((entry) => (
        <ProjectTableRow key={entry.id}>
          <ProjectTableCell className="whitespace-nowrap text-muted-foreground">
            {entry.date}
          </ProjectTableCell>
          <ProjectTableCell className="font-medium text-foreground">
            {entry.description}
          </ProjectTableCell>
          <ProjectTableCell className="whitespace-nowrap text-muted-foreground">
            {entry.type}
          </ProjectTableCell>
          <ProjectTableCell>
            <StatusBadge status={entry.status} />
          </ProjectTableCell>
          <ProjectTableCell align="right" className="font-bold text-foreground">
            {entry.amount}
          </ProjectTableCell>
        </ProjectTableRow>
      ))}
    </ProjectTable>
  );
}
