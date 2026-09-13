import { resolveAvatarUrl } from '@/utils/helpers/resolve-avatar-url';

export interface SubmissionAttachment {
  url: string;
  /** Absolute URL safe for `<a href>` / download. */
  href: string;
  originalName: string;
  mimeType?: string;
  size?: number;
}

/**
 * Normalize the JSON `attachments` column (and optional fallback URL) into a
 * display-ready attachment. Returns null when nothing was uploaded.
 */
export function parseSubmissionAttachment(
  attachments: Record<string, unknown> | null | undefined,
  fallbackUrl?: string | null,
): SubmissionAttachment | null {
  const rawUrl =
    (typeof attachments?.url === 'string' && attachments.url.trim()) ||
    (typeof fallbackUrl === 'string' && fallbackUrl.trim()) ||
    '';

  if (!rawUrl) return null;

  const href = resolveAvatarUrl(rawUrl) ?? rawUrl;
  const originalName =
    (typeof attachments?.original_name === 'string' &&
      attachments.original_name.trim()) ||
    rawUrl.split('/').pop()?.split('?')[0] ||
    'Supporting evidence';

  const mimeType =
    typeof attachments?.mime_type === 'string'
      ? attachments.mime_type
      : undefined;
  const size =
    typeof attachments?.size === 'number' ? attachments.size : undefined;

  return {
    url: rawUrl,
    href,
    originalName,
    mimeType,
    size,
  };
}
