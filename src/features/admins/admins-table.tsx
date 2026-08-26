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
            <div className="text-[11px] text-muted-foreground">{admin.email}</div>
          </ProjectTableCell>
          <ProjectTableCell>
            <StatusBadge status={admin.roleLabel} />
          </ProjectTableCell>
          <ProjectTableCell className="whitespace-nowrap text-muted-foreground">
            {admin.addedOn}
          </ProjectTableCell>
          <ProjectTableCell>
            {canManage && admin.access !== 'owner' ? (
              <button
                type="button"
                className="rounded-full border border-danger-subtle bg-card px-[13px] py-[7px] text-xs font-bold text-danger hover:bg-danger-subtle transition-colors cursor-pointer"
                onClick={() => onRemove(admin)}
              >
                Remove
              </button>
            ) : (
              <span className="text-[12px] text-text-tertiary">
                {admin.access === 'owner' ? 'Protected' : '—'}
              </span>
            )}
          </ProjectTableCell>
        </ProjectTableRow>
      ))}
    </ProjectTable>
  );
}
