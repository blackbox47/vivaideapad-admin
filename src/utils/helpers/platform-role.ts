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

export function isPlatformRole(v: unknown): v is PlatformRole {
  return v === 1 || v === 2 || v === 3;
}

export function parsePlatformRole(
  value: unknown,
  fallback: PlatformRole = 1,
): PlatformRole {
  const numeric = typeof value === 'number' ? value : Number(value);
  return isPlatformRole(numeric) ? numeric : fallback;
}

export function formatPlatformRole(role: PlatformRole): string {
  return PLATFORM_ROLE_LABELS[role];
}

export function isSuperAdmin(role: unknown): boolean {
  return parsePlatformRole(role, 1) === 1 && Number(role) === 1;
}