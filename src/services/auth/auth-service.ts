import type {
  LoginRequest,
  LoginResponse,
} from '@/models/auth/auth-model';
import type { ProfileOverview } from '@/models/profile/profile-model';
import { baseService } from '@/services/core/base-service';
import {
  AUTH_SIGN_IN_URL,
  PROFILE_OVERVIEW_URL,
} from '@/utils/constants/api-end-points';

export const authService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * The backend exposes `GET /admin/profile` as the single self-profile
     * endpoint; the SPA has two consumers with different shapes:
     *  - `useAdminUser` wants the slim `AuthUser` view (sidebar identity).
     *  - `useProfileOverview` wants the full `ProfileOverview` (settings page).
     * Both wire to the same URL but `useAdminUser` reshapes `ProfileOverview`
     * down to `AuthUser` in `hooks/auth/use-admin-user.ts`.
     */
    getCurrentAdmin: builder.query<ProfileOverview, void>({
      query: () => ({ url: PROFILE_OVERVIEW_URL, method: 'GET' }),
      providesTags: ['admin-user'],
    }),
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({ url: AUTH_SIGN_IN_URL, method: 'POST', body }),
      invalidatesTags: ['admin-user', 'dashboard'],
    }),
  }),
});

export const { useGetCurrentAdminQuery, useLoginMutation } = authService;
