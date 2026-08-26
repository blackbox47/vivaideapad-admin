export type WorkspaceAdminAccess = 'owner' | 'admin';

export interface WorkspaceAdmin {
  id: string;
  name: string;
  email: string;
  access: WorkspaceAdminAccess;
  roleLabel: string;
  initials: string;
  /** Pre-formatted date string (DD-MM-YYYY) used by the table. */
  addedOn: string;
  /** ISO timestamp used for sorting. */
  addedAt: string;
}

export interface WorkspaceAdminsResponse {
  admins: WorkspaceAdmin[];
  canManage: boolean;
}

export interface CreateAdminBody {
  name: string;
  email: string;
}

export interface CreateAdminResponse {
  admin: WorkspaceAdmin;
  createdAt: string;
}

export interface RemoveAdminResponse {
  id: string;
  removedAt: string;
}
