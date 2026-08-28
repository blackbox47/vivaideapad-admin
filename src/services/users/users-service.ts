import type { PlatformUser } from '@/models/people/people-model';
import type {
  UserAccessStatusBody,
  UserDeleteResponse,
  UserDetail,
  UserRoleBody,
  UserUpdateResponse,
} from '@/models/users/users-model';
import { baseService } from '@/services/core/base-service';
import type { PlatformRole } from '@/utils/helpers/platform-role';
import {
  USER_ACCESS_STATUS_URL,
  USER_DETAIL_URL,
  USER_ROLE_URL,
  USERS_URL,
} from '@/utils/constants/api-end-points';

export interface UsersListParams {
  role?: 'all' | PlatformRole;
  accessStatus?: 'all' | 'Active' | 'Invited' | 'Suspended';
  search?: string;
  page?: number;
  limit?: number;
}

export interface UsersListResponse {
  data: PlatformUser[];
  total: number;
}

export const usersService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    /** Spec §5.7 — GET /admin/users */
    getUsers: builder.query<UsersListResponse, UsersListParams | void>({
      query: (params) => ({
        url: USERS_URL,
        method: 'GET',
        params: {
          role: params?.role,
          access_status: params?.accessStatus,
          search: params?.search,
          page: params?.page,
          limit: params?.limit,
        },
      }),
      providesTags: ['users'],
    }),
    /** Spec §5.7 — GET /admin/users/:id (360 view) */
    getUser: builder.query<{ user: UserDetail }, string>({
      query: (id) => ({ url: USER_DETAIL_URL(id), method: 'GET' }),
      providesTags: (_r, _e, id) => [{ type: 'users', id }],
    }),
    /** Spec §5.7 — PATCH /admin/users/:id/access-status */
    updateUserAccessStatus: builder.mutation<
      UserUpdateResponse,
      { id: string; body: UserAccessStatusBody }
    >({
      query: ({ id, body }) => ({
        url: USER_ACCESS_STATUS_URL(id),
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['users', 'people', 'audit-log', 'audit-events'],
    }),
    /** Spec §5.7 — PATCH /admin/users/:id/role */
    updateUserRole: builder.mutation<
      UserUpdateResponse,
      { id: string; body: UserRoleBody }
    >({
      query: ({ id, body }) => ({
        url: USER_ROLE_URL(id),
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['users', 'people', 'audit-log', 'audit-events'],
    }),
    /** Spec §5.7 — DELETE /admin/users/:id (soft delete) */
    deleteUser: builder.mutation<UserDeleteResponse, string>({
      query: (id) => ({
        url: USER_DETAIL_URL(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['users', 'people', 'audit-log', 'audit-events'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useLazyGetUserQuery,
  useGetUserQuery,
  useUpdateUserAccessStatusMutation,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
} = usersService;