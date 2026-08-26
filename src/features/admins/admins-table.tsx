import StatusBadge from '@/components/shared/status-badge';
import {
  ProjectTable,
  ProjectTableCell,
  ProjectTableRow,
} from '@/components/ui/project-table';
import type { WorkspaceAdmin } from '@/models/admins/admins-model';

interface AdminsTableProps {
  admins: WorkspaceAdmin[];
  canManage: boolean;
  onRemove: (admin: WorkspaceAdmin) => void;
}

export default function AdminsTable({
  admins,
  canManage,
  onRemove,
}: AdminsTableProps) {
  return (
    <ProjectTable
      columns={[
        { label: 'Admin' },
        { label: 'Role' },
        { label: 'Added' },
        { label: '', isAction: true },
      ]}
    >
      {admins.map((admin) => (
        <ProjectTableRow key={admin.id}>
          <ProjectTableCell>
            <strong className="font-semibold text-foreground">
              {admin.name}
            </strong>
            <div className="text-[11px] text-[#687773]">{admin.email}</div>
          </ProjectTableCell>
          <ProjectTableCell>
            <StatusBadge status={admin.roleLabel} />
          </ProjectTableCell>
          <ProjectTableCell className="whitespace-nowrap text-[#687773]">
            {admin.addedOn}
          </ProjectTableCell>
          <ProjectTableCell>
            {canManage && admin.access !== 'owner' ? (
              <button
                type="button"
                className="rounded-full border border-[#ffe6d5] bg-white px-[13px] py-[7px] text-xs font-bold text-[#b3401f]"
                onClick={() => onRemove(admin)}
              >
                Remove
              </button>
            ) : (
              <span className="text-[12px] text-[#82948e]">
                {admin.access === 'owner' ? 'Protected' : '—'}
              </span>
            )}
          </ProjectTableCell>
        </ProjectTableRow>
      ))}
    </ProjectTable>
  );
}
