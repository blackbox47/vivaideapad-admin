import StatusBadge from '@/components/shared/status-badge';
import type { PlatformUser } from '@/models/people/people-model';
import PeopleTable from '@/features/people/people-table';

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
      <div className="rounded-[22px] border border-border bg-card px-6 py-[50px] text-center text-muted-foreground">
        No one is currently waiting on their first live-task submission.
      </div>
    );
  }

  return (
    <PeopleTable
      columns={['Invited applicant', 'Approved on', 'Status', 'Waiting on', '']}
    >
      {users.map((user) => (
        <tr key={user.id} className="border-t border-border-muted">
          <td className="px-[18px] py-3.5">
            <strong className="font-semibold text-foreground">{user.name}</strong>
            <div className="text-[11px] text-muted-foreground">{user.email}</div>
          </td>
          <td className="px-[18px] py-3.5 whitespace-nowrap text-muted-foreground">
            {user.joined}
          </td>
          <td className="px-[18px] py-3.5">
            <StatusBadge status={user.status} />
          </td>
          <td className="px-[18px] py-3.5 text-[13px] text-muted-foreground">
            First submission on a live task
          </td>
          <td className="px-[18px] py-3.5">
            <button
              type="button"
              disabled={isToggling}
              className="rounded-full border border-border bg-card px-[13px] py-[7px] text-xs font-bold text-foreground hover:bg-surface-subtle transition-colors disabled:opacity-60 cursor-pointer"
              onClick={() => onToggle(user)}
            >
              {user.status === 'Suspended' ? 'Reactivate' : 'Suspend'}
            </button>
          </td>
        </tr>
      ))}
    </PeopleTable>
  );
}
