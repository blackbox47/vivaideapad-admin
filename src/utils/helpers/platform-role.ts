import {
  PLATFORM_ROLES,
  PLATFORM_ROLE_LABELS,
  type PlatformRole,
} from '@/utils/constants/platform-roles';

export {
  PLATFORM_ROLES,
  PLATFORM_ROLE_LABELS,
  type PlatformRole,
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