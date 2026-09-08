import { env } from '@/config/env';

/**
 * Normalizes an avatar URL for display in `<AvatarImage>` or CSS backgrounds.
 *
 * Handles:
 * - Absolute HTTP(S) and data: URIs (passed through unmodified).
 * - Relative backend paths like `/api/v1/uploads/files/...` (prepends API host origin).
 * - Empty / null / undefined (returns null so `<AvatarFallback>` renders).
 */
export function resolveAvatarUrl(
  url: string | null | undefined,
): string | null {
  if (!url || typeof url !== 'string') {
    return null;
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return null;
  }

  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  if (trimmed.startsWith('/')) {
    try {
      const base = new URL(env.apiBaseUrl);
      return new URL(trimmed, base.origin).toString();
    } catch {
      return trimmed;
    }
  }

  return trimmed;
}
