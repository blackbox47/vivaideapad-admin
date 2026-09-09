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

interface InvitedTableProps {
  users: PlatformUser[];
  onToggle: (user: PlatformUser) => void;
  isToggling: boolean;
}

export default function InvitedTable({
  users,
  onToggle,
  isToggling,
}: InvitedTableProps) {
  if (users.length === 0) {
    return (
      <EmptyState
        title="No invited applicants"
        description="No one is currently waiting on their first live-task submission."
      />
    );
  }

  return (
    <PeopleTable
      columns={['Invited applicant', 'Approved on', 'Status', 'Waiting on', '']}
    >
      {users.map((user) => (
        <ProjectTableRow key={user.id}>
          <ProjectTableCell>
            <strong className="font-semibold text-foreground">{user.name}</strong>
            <div className="text-[11px] text-muted-foreground">{user.email}</div>
          </ProjectTableCell>
          <ProjectTableCell className="whitespace-nowrap text-muted-foreground">
            {user.joined}
          </ProjectTableCell>
          <ProjectTableCell>
            <StatusBadge status={user.status} />
          </ProjectTableCell>
          <ProjectTableCell className="text-[13px] text-muted-foreground">
            First submission on a live task
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
