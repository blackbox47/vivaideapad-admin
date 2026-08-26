import { createApi } from '@reduxjs/toolkit/query/react';

import { customFetch } from '@/services/core/custom-fetch';

/**
 * Root API slice. Domain services extend it via `injectEndpoints` so each
 * feature owns its endpoints while sharing one cache and one transport.
 */
export const baseService = createApi({
  reducerPath: 'api',
  baseQuery: customFetch,
  tagTypes: [
    'dashboard',
    'admin-user',
    'concepts',
    'people',
    'review',
    'rewards',
    'payouts',
    'leaderboard',
    'reports',
    'audit-log',
    'admins',
    'admin-notifications',
    'profile',
    'creator-dashboard',
    'my-ideas',
    'creator-topics',
    'creator-user',
    'creator-rewards',
    'creator-leaderboard',
    'creator-notifications',
    'creator-profile',
  ],
  endpoints: () => ({}),
});
