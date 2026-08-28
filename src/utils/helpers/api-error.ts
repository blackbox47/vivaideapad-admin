import type { ApiError } from '@/models/api/api-model';

function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    'message' in error
  );
}

/**
 * Recognises the spec's RFC 7807 error envelope (`{ error: { code, message,
 * details } }`) on either the wrapper or the inner object. The legacy RTK
 * Query shape `{ status, message }` is recognised by `isApiError`.
 */
function readSpecEnvelope(error: unknown): string | null {
  if (!error || typeof error !== 'object') {
    return null;
  }
  const candidate = error as { error?: unknown; message?: unknown };
  if (
    candidate.error &&
    typeof candidate.error === 'object' &&
    candidate.error !== null &&
    typeof (candidate.error as { message?: unknown }).message === 'string'
  ) {
    return (candidate.error as { message: string }).message;
  }
  if (typeof candidate.message === 'string') {
    return candidate.message;
  }
  return null;
}

export function getApiErrorMessage(error: unknown): string | null {
  if (!error) {
    return null;
  }

  const spec = readSpecEnvelope(error);
  if (spec) {
    return spec;
  }

  if (isApiError(error)) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
}
