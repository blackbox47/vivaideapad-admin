import type {
  AdminUser,
  LoginRequest,
  LoginResponse,
} from '@/models/auth/auth-model';
import { baseService } from '@/services/core/base-service';
import {
  ADMIN_ME_URL,
  AUTH_LOGIN_URL,
} from '@/utils/constants/api-end-points';

export const authService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentAdmin: builder.query<AdminUser, void>({
      query: () => ({ url: ADMIN_ME_URL, method: 'GET' }),
      providesTags: ['admin-user'],
    }),
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({ url: AUTH_LOGIN_URL, method: 'POST', body }),
      invalidatesTags: ['admin-user', 'dashboard'],
    }),
  }),
});

export const { useGetCurrentAdminQuery, useLoginMutation } = authService;
