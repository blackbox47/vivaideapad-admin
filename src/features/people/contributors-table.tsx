import EmptyState from '@/components/shared/empty-state';
import StatusBadge from '@/components/shared/status-badge';
import TableActions from '@/components/shared/table-actions';
import { Button } from '@/components/ui/button';
import {
  ProjectTableCell,
  ProjectTableRow,
} from '@/components/ui/project-table';
import PeopleTable from '@/features/people/people-table';
import type { PlatformUser } from '@/models/people/people-model';

interface ContributorsTableProps {
  users: PlatformUser[];
  onToggle: (user: PlatformUser) => void;
  isToggling: boolean;
}

export default function ContributorsTable({
  users,
  onToggle,
  isToggling,
}: ContributorsTableProps) {
  if (users.length === 0) {
    return (
      <EmptyState
        title="No contributors yet"
        description="Approve applicants and wait for their first live submission."
      />
    );
  }

  return (
    <PeopleTable
      columns={['Contributor', 'Approved', 'Balance', 'Joined', 'Status', '']}
    >
      {users.map((user) => (
        <ProjectTableRow key={user.id}>
          <ProjectTableCell>
            <strong className="font-semibold text-foreground">{user.name}</strong>
            <div className="text-[11px] text-muted-foreground">{user.email}</div>
          </ProjectTableCell>
          <ProjectTableCell className="text-foreground">{user.approved}</ProjectTableCell>
          <ProjectTableCell className="text-foreground">{user.balance}</ProjectTableCell>
          <ProjectTableCell className="whitespace-nowrap text-muted-foreground">
            {user.joined}
          </ProjectTableCell>
          <ProjectTableCell>
            <StatusBadge status={user.status} />
          </ProjectTableCell>
          <ProjectTableCell>
            <TableActions>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isToggling}
                loading={isToggling}
                className="h-auto rounded-full border border-border bg-card px-[13px] py-[7px] text-xs font-bold text-foreground hover:bg-surface-subtle"
                onClick={() => onToggle(user)}
              >
                {user.status === 'Suspended' ? 'Reactivate' : 'Suspend'}
              </Button>
            </TableActions>
          </ProjectTableCell>
        </ProjectTableRow>
      ))}
    </PeopleTable>
  );
}
