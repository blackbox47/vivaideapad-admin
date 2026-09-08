import type {
  LoginRequest,
  LoginResponse,
} from '@/models/auth/auth-model';
import type { ProfileOverview } from '@/models/profile/profile-model';
import { baseService } from '@/services/core/base-service';
import {
  AUTH_ADMIN_SIGN_IN_URL,
  AUTH_FORGOT_PASSWORD_URL,
  AUTH_SIGN_IN_URL,
  AUTH_SIGN_OUT_URL,
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
    /**
     * Admin-only sign-in. Hits `POST /auth/admin/sign-in`, which rejects
     * non-admin (e.g. CONTRIBUTOR) users with the same generic 401 used for
     * bad credentials. The wire payload is identical to `login`, so the
     * response types are shared.
     */
    adminLogin: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: AUTH_ADMIN_SIGN_IN_URL,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['admin-user', 'dashboard'],
    }),
    /**
     * Server-side sign-out. The backend clears the auth cookies via
     * `Set-Cookie` with `Max-Age=0`; the SPA then dispatches
     * `sessionCleared` to reset Redux.
     */
    signOut: builder.mutation<void, void>({
      query: () => ({ url: AUTH_SIGN_OUT_URL, method: 'POST' }),
    }),
    forgotPassword: builder.mutation<void, { email: string }>({
      query: (body) => ({ url: AUTH_FORGOT_PASSWORD_URL, method: 'POST', body }),
    }),
  }),
});

export const {
  useGetCurrentAdminQuery,
  useLoginMutation,
  useAdminLoginMutation,
  useSignOutMutation,
  useForgotPasswordMutation,
} = authService;