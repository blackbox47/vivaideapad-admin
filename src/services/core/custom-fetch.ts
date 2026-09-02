import type { BaseQueryFn } from '@reduxjs/toolkit/query';

import { env } from '@/config/env';
import type { ApiError, ApiRequest } from '@/models/api/api-model';
import { sessionExpired } from '@/reducers/auth-slice';
import { AUTH_REFRESH_URL } from '@/utils/constants/api-end-points';

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
    if (typeof record.error?.message === 'string') {
      return record.error.message;
    }
    if (typeof record.message === 'string') {
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

async function performRefresh(signal: AbortSignal | undefined): Promise<boolean> {
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

/**
 * Single HTTP seam for the app. Components never call `fetch` directly — they
 * consume the typed hooks generated from `baseService.injectEndpoints`.
 *
 * Tokens travel in HttpOnly cookies set by the backend; the SPA never sends
 * an `Authorization` header. On a 401 we fire a single-flight `/auth/refresh`
 * and retry the original request once. If the refresh also fails (or the
 * backend has revoked the session family), we dispatch `sessionExpired` so
 * the store resets and the SPA can redirect to login.
 */
export const customFetch: BaseQueryFn<ApiRequest, unknown, ApiError> = async (
  request,
  apiArg,
) => {
  const isRefreshRoute = request.url === AUTH_REFRESH_URL;

  try {
    const first = await issueRequest(request, apiArg.signal);
    if (first.ok) {
      return { data: await parseBody(first) };
    }

    if (first.status !== 401 || isRefreshRoute) {
      const payload = await parseBody(first);
      return {
        error: {
          status: first.status,
          message: readErrorMessage(payload, first.statusText),
        },
      };
    }

    const refreshed = await refreshAccessToken(apiArg.signal);
    if (!refreshed) {
      apiArg.dispatch(sessionExpired());
      return {
        error: { status: 401, message: 'Session expired. Please sign in again.' },
      };
    }

    const retry = await issueRequest(request, apiArg.signal);
    const payload = await parseBody(retry);
    if (retry.ok) {
      return { data: payload };
    }
    return {
      error: {
        status: retry.status,
        message: readErrorMessage(payload, retry.statusText),
      },
    };
  } catch (error) {
    return {
      error: {
        status: 0,
        message: error instanceof Error ? error.message : 'Network request failed',
      },
    };
  }
};