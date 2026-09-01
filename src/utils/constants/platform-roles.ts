/**
 * Platform role enum — mirrors the backend's `users.role` column (tinyint).
 *
 * 1 = Super Admin, 2 = Administrator, 3 = Contributor.
 *
 * This is the wire-level numeric representation. The workspace discriminator
 * `'admin' | 'creator'` (used for route gating and login) is independent of
 * this enum and lives in `models/auth/auth-model.ts`.
 */
export const PLATFORM_ROLES = [1, 2, 3] as const;
export type PlatformRole = (typeof PLATFORM_ROLES)[number];

export const PLATFORM_ROLE_LABELS: Record<PlatformRole, string> = {
  1: 'Super Admin',
  2: 'Administrator',
  3: 'Contributor',
};
