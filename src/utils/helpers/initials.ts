/**
 * Derive avatar initials from a display name or email. The live backend
 * (`/auth/sign-in`, `/admin/profile`) returns `display_name` but not
 * `initials`, so the SPA synthesizes them at render time. Replaces the old
 * `initials` field that the mock fixtures produced.
 *
 * Rules:
 * - Prefer `displayName`; fall back to the local part of `email`.
 * - One word → first two characters, uppercased.
 * - Two or more words → first letter of the first + first letter of the last.
 * - Empty input → `?` (avoid a blank avatar bubble).
 */
export function deriveInitials(
  displayName: string | null | undefined,
  email: string,
): string {
  const source = (displayName ?? '').trim() || email.split('@')[0] || '';
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}