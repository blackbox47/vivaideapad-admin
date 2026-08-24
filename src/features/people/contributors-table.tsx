import StatusBadge from '@/components/shared/status-badge';
import type { PlatformUser } from '@/models/people/people-model';
import PeopleTable from '@/features/people/people-table';

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
      <div className="rounded-[22px] border border-[#dfe7e3] bg-white px-6 py-[50px] text-center text-[#687773]">
        No contributors yet — approve applicants and wait for their first live
        submission.
      </div>
    );
  }

  return (
    <PeopleTable
      columns={['Contributor', 'Approved', 'Balance', 'Joined', 'Status', '']}
    >
      {users.map((user) => (
        <tr key={user.id} className="border-t border-[#eef1ef]">
          <td className="px-[18px] py-3.5">
            <strong className="font-semibold text-foreground">{user.name}</strong>
            <div className="text-[11px] text-[#687773]">{user.email}</div>
          </td>
          <td className="px-[18px] py-3.5">{user.approved}</td>
          <td className="px-[18px] py-3.5">{user.balance}</td>
          <td className="px-[18px] py-3.5 whitespace-nowrap text-[#687773]">
            {user.joined}
          </td>
          <td className="px-[18px] py-3.5">
            <StatusBadge status={user.status} />
          </td>
          <td className="px-[18px] py-3.5">
            <button
              type="button"
              disabled={isToggling}
              className="rounded-full border border-[#dfe7e3] bg-white px-[13px] py-[7px] text-xs font-bold text-foreground disabled:opacity-60"
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
