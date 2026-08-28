import type { BaseQueryFn } from '@reduxjs/toolkit/query';

import { env } from '@/config/env';
import type { ApiError, ApiRequest } from '@/models/api/api-model';
import { logout } from '@/reducers/auth-slice';
import { resolveMockRequest } from '@/services/mock/mock-handlers';
import type { RootState } from '@/store';
import {
  AUTH_TOKEN_STORAGE_KEY,
  CREATOR_AUTH_TOKEN_STORAGE_KEY,
} from '@/utils/constants/storage-keys';

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

/**
 * Single HTTP seam for the app. Components never call `fetch` directly — they
 * consume the typed hooks generated from `baseService.injectEndpoints`.
 */
export const customFetch: BaseQueryFn<ApiRequest, unknown, ApiError> = async (
  request,
  api,
) => {
  if (env.useMockApi) {
    const token = (api.getState() as RootState).auth.token;
    return resolveMockRequest(request, token);
  }

  const token = (api.getState() as RootState).auth.token;
  const isFormData = request.body instanceof FormData;
  const url = `${env.apiBaseUrl.replace(/\/+$/, '')}${request.url}${buildQueryString(request.params)}`;

  try {
    const response = await fetch(url, {
      method: request.method ?? 'GET',
      signal: api.signal,
      headers: {
        // FormData uploads must keep the browser-generated boundary header.
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: isFormData
        ? (request.body as FormData)
        : request.body === undefined
          ? undefined
          : JSON.stringify(request.body),
    });

    const contentType = response.headers.get('content-type') ?? '';
    const isTextOrCsv =
      contentType.includes('text/csv') ||
      contentType.includes('text/plain') ||
      contentType.includes('application/csv');

    const payload =
      response.status === 204
        ? null
        : isTextOrCsv
          ? await response.text()
          : await response.json().catch(() => response.text().catch(() => null));

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
        localStorage.removeItem(CREATOR_AUTH_TOKEN_STORAGE_KEY);
        api.dispatch(logout());
      }

      return {
        error: {
          status: response.status,
          message: readErrorMessage(payload, response.statusText),
        },
      };
    }

    return { data: payload };
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
