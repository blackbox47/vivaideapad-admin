export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiRequest {
  url: string;
  method?: ApiMethod;
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
}

export interface ApiError {
  status: number;
  message: string;
}

export type ApiResult = { data: unknown } | { error: ApiError };
