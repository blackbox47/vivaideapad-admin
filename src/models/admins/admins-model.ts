import type { PlatformRole } from '@/utils/helpers/platform-role';

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
}

/** Wire payload from GET/POST `/admin/admins` (Nest `SerializedAdminAccount`). */
export interface SerializedAdminAccount {
  id: string;
  email: string;
  display_name: string | null;
  role: PlatformRole;
  access_status: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateAdminBody {
  email: string;
  password: string;
  display_name?: string;
}
