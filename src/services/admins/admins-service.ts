import type {
  CreateAdminBody,
  CreateAdminResponse,
  RemoveAdminResponse,
  WorkspaceAdminsResponse,
} from '@/models/admins/admins-model';
import { baseService } from '@/services/core/base-service';
import { ADMINS_URL } from '@/utils/constants/api-end-points';

export const adminsService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    getWorkspaceAdmins: builder.query<WorkspaceAdminsResponse, void>({
      query: () => ({
        url: ADMINS_URL,
        method: 'GET',
      }),
      providesTags: ['admins'],
    }),
    createWorkspaceAdmin: builder.mutation<
      CreateAdminResponse,
      CreateAdminBody
    >({
      query: (body) => ({
        url: ADMINS_URL,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['admins', 'audit-log'],
    }),
    removeWorkspaceAdmin: builder.mutation<RemoveAdminResponse, string>({
      query: (id) => ({
        url: ADMINS_URL,
        method: 'DELETE',
        params: { id },
      }),
      invalidatesTags: ['admins', 'audit-log'],
    }),
  }),
});

export const {
  useGetWorkspaceAdminsQuery,
  useCreateWorkspaceAdminMutation,
  useRemoveWorkspaceAdminMutation,
} = adminsService;
