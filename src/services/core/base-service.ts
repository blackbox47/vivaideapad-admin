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
    'categories',
    'concepts',
    'applications',
    'people',
    'submissions',
    'review',
    'ledger',
    'rewards',
    'payouts',
    'leaderboard',
    'users',
    'reports',
    'audit-log',
    'audit-events',
    'admins',
    'admin-notifications',
    'profile',
    'uploads',
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
