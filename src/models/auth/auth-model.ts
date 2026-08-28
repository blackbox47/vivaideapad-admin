/**
 * Wire-format auth types from the live NestJS backend (`POST /auth/sign-in`,
 * `GET /admin/profile`). The previous `AdminUser` was a display-shaped mock
 * type; this file now mirrors the backend DTOs exactly so the SPA can speak
 * the same language as the API.
 *
 * The workspace discriminator `UserRole` ('admin' | 'creator') is independent
 * — it is a UI concern derived from which login panel mounted, not from the
 * server response. It stays in this file because it travels alongside auth.
 */
import type { PlatformRole } from '@/utils/helpers/platform-role';

export type UserRole = 'admin' | 'creator';

/**
 * Backend `AuthUserSchema` (`vivaideapad-api/src/auth/dto/tokens.dto.ts`).
 * Snake-case field names are kept so the wire payload matches the API
 * verbatim; the SPA does not transform them.
 */
export type UserAccessStatus =
  | 'active'
  | 'invited'
  | 'suspended'
  | 'pending_review';

export interface AuthUser {
  id: string;
  email: string;
  display_name: string | null;
  role: PlatformRole;
  access_status: UserAccessStatus;
}

export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Backend `TokensSchema` — `access_token` is the only token the SPA stores
 * for now (refresh-token rotation is out of scope; see plan §10).
 */
export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: 'Bearer';
  expires_in: number;
  user: AuthUser;
}