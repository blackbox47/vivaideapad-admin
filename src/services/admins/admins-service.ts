import type {
  CreateAdminBody,
  SerializedAdminAccount,
  WorkspaceAdmin,
  WorkspaceAdminsResponse,
} from '@/models/admins/admins-model';
import { baseService } from '@/services/core/base-service';
import { ADMIN_DETAIL_URL, ADMINS_URL } from '@/utils/constants/api-end-points';
import { deriveInitials } from '@/utils/helpers/initials';

function formatAddedOn(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}-${month}-${date.getFullYear()}`;
}

function isSerializedAdmin(value: unknown): value is SerializedAdminAccount {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as SerializedAdminAccount).id === 'string' &&
    typeof (value as SerializedAdminAccount).email === 'string'
  );
}

export function toWorkspaceAdmin(
  account: SerializedAdminAccount,
): WorkspaceAdmin {
  const isOwner = account.role === 1;
  const name = account.display_name?.trim() || account.email;
  const addedAt =
    typeof account.created_at === 'string'
      ? account.created_at
      : new Date(account.created_at).toISOString();

  return {
    id: account.id,
    name,
    email: account.email,
    access: isOwner ? 'owner' : 'admin',
    roleLabel: isOwner ? 'Super Admin' : 'Admin',
    initials: deriveInitials(account.display_name, account.email),
    addedOn: formatAddedOn(addedAt),
    addedAt,
  };
}

function toWorkspaceAdminsResponse(response: unknown): WorkspaceAdminsResponse {
  if (!response || typeof response !== 'object') {
    return { admins: [] };
  }

  const record = response as Record<string, unknown>;

  if (Array.isArray(record.admins)) {
    return { admins: record.admins as WorkspaceAdmin[] };
  }

  if (Array.isArray(record.data)) {
    return {
      admins: record.data.filter(isSerializedAdmin).map(toWorkspaceAdmin),
    };
  }

  return { admins: [] };
}

export const adminsService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    getWorkspaceAdmins: builder.query<WorkspaceAdminsResponse, void>({
      query: () => ({
        url: ADMINS_URL,
        method: 'GET',
        params: { page: 1, limit: 100 },
      }),
      transformResponse: toWorkspaceAdminsResponse,
      providesTags: ['admins'],
    }),
    createWorkspaceAdmin: builder.mutation<WorkspaceAdmin, CreateAdminBody>({
      query: (body) => ({
        url: ADMINS_URL,
        method: 'POST',
        body,
      }),
      transformResponse: (response: unknown): WorkspaceAdmin => {
        if (isSerializedAdmin(response)) {
          return toWorkspaceAdmin(response);
        }

        const record = response as { admin?: WorkspaceAdmin };
        if (record.admin) {
          return record.admin;
        }

        throw new Error('Unexpected create-admin response');
      },
      invalidatesTags: ['admins', 'audit-log', 'audit-events'],
    }),
    removeWorkspaceAdmin: builder.mutation<{ deleted: boolean }, string>({
      query: (id) => ({
        url: ADMIN_DETAIL_URL(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['admins', 'audit-log', 'audit-events'],
    }),
  }),
});

export const {
  useGetWorkspaceAdminsQuery,
  useCreateWorkspaceAdminMutation,
  useRemoveWorkspaceAdminMutation,
} = adminsService;
