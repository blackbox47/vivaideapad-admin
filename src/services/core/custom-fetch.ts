import type { BaseQueryFn } from '@reduxjs/toolkit/query';

import { env } from '@/config/env';
import type { ApiError, ApiRequest } from '@/models/api/api-model';
import { sessionExpired } from '@/reducers/auth-slice';
import {
  AUTH_ADMIN_SIGN_IN_URL,
  AUTH_FORGOT_PASSWORD_URL,
  AUTH_GOOGLE_SIGN_IN_URL,
  AUTH_GOOGLE_SIGN_UP_URL,
  AUTH_REFRESH_URL,
  AUTH_SIGN_IN_URL,
  AUTH_SIGN_UP_URL,
} from '@/utils/constants/api-end-points';

/**
 * Public auth endpoints that return 401/403 for bad credentials or policy
 * failures. A 401 here is NOT an expired session — do not attempt refresh
 * or dispatch `sessionExpired`, or the SPA always shows
 * "Session expired. Please sign in again."
 */
const AUTH_CREDENTIAL_URLS = new Set<string>([
  AUTH_SIGN_IN_URL,
  AUTH_ADMIN_SIGN_IN_URL,
  AUTH_GOOGLE_SIGN_IN_URL,
  AUTH_GOOGLE_SIGN_UP_URL,
  AUTH_SIGN_UP_URL,
  AUTH_FORGOT_PASSWORD_URL,
]);

function buildQueryString(params: ApiRequest['params']): string {
  if (!params) {
    return '';
  }

  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      search.append(key, String(value));
    }
  });

  const query = search.toString();
  return query ? `?${query}` : '';
}

function readErrorMessage(payload: unknown, fallback: string): string {
  if (typeof payload === 'object' && payload !== null) {
    const record = payload as {
      message?: unknown;
      error?: { message?: unknown };
    };
    if (typeof record.error?.message === 'string' && record.error.message) {
      return record.error.message;
    }
    if (typeof record.message === 'string' && record.message) {
      return record.message;
    }
  }
  return fallback;
}

async function parseBody(response: Response): Promise<unknown> {
  if (response.status === 204) return null;
  const contentType = response.headers.get('content-type') ?? '';
  if (
    contentType.includes('text/csv') ||
    contentType.includes('text/plain')
  ) {
    return response.text();
  }
  return response.json().catch(() => response.text().catch(() => null));
}

/**
 * Single in-flight refresh promise. Cleared on settle so the next 401 starts
 * a fresh refresh. Concurrent 401s share the same promise.
 */
let refreshInFlight: Promise<boolean> | null = null;

async function performRefresh(
  signal: AbortSignal | undefined,
): Promise<boolean> {
  const url = `${env.apiBaseUrl.replace(/\/+$/, '')}${AUTH_REFRESH_URL}`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      signal,
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function refreshAccessToken(
  signal: AbortSignal | undefined,
): Promise<boolean> {
  if (!refreshInFlight) {
    refreshInFlight = performRefresh(signal).finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

async function issueRequest(
  request: ApiRequest,
  signal: AbortSignal | undefined,
): Promise<Response> {
  const isFormData = request.body instanceof FormData;
  const url = `${env.apiBaseUrl.replace(/\/+$/, '')}${request.url}${buildQueryString(request.params)}`;
  return fetch(url, {
    method: request.method ?? 'GET',
    credentials: 'include',
    signal,
    headers: {
      // FormData uploads must keep the browser-generated boundary header.
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    },
    body: isFormData
      ? (request.body as FormData)
      : request.body === undefined
        ? undefined
        : JSON.stringify(request.body),
  });
}

function toErrorResult(
  status: number,
  payload: unknown,
  fallback: string,
): { error: ApiError } {
  return {
    error: {
      status,
      message: readErrorMessage(payload, fallback),
    },
  };
}

/**
 * Single HTTP seam for the app. Components never call `fetch` directly — they
 * consume the typed hooks generated from `baseService.injectEndpoints`.
 *
 * Tokens travel in HttpOnly cookies set by the backend; the SPA never sends
 * an `Authorization` header. On a 401 from an authenticated API we fire a
 * single-flight `/auth/refresh` and retry once. Public auth routes skip that
 * path so credential failures surface their API message.
 */
export const customFetch: BaseQueryFn<ApiRequest, unknown, ApiError> = async (
  request,
  apiArg,
) => {
  const isRefreshRoute = request.url === AUTH_REFRESH_URL;
  const isCredentialRoute = AUTH_CREDENTIAL_URLS.has(request.url);

  try {
    const first = await issueRequest(request, apiArg.signal);
    if (first.ok) {
      return { data: await parseBody(first) };
    }

    // Auth/sign-in style 401s mean bad credentials (or similar) — return the
    // API body as-is. Never treat them as an expired session.
    if (first.status !== 401 || isRefreshRoute || isCredentialRoute) {
      const payload = await parseBody(first);
      return toErrorResult(first.status, payload, first.statusText);
    }

    const refreshed = await refreshAccessToken(apiArg.signal);
    if (!refreshed) {
      apiArg.dispatch(sessionExpired());
      return {
        error: {
          status: 401,
          message: 'Session expired. Please sign in again.',
        },
      };
    }

    const retry = await issueRequest(request, apiArg.signal);
    const payload = await parseBody(retry);
    if (retry.ok) {
      return { data: payload };
    }
    return toErrorResult(retry.status, payload, retry.statusText);
  } catch (error) {
    return {
      error: {
        status: 0,
        message:
          error instanceof Error ? error.message : 'Network request failed',
      },
    };
  }
};
