import type {
  ApiCreateConceptBody,
  ApiUpdateConceptBody,
  Concept,
  ConceptDetail,
  ConceptListParams,
  ConceptListResponse,
  ConceptStatus,
  BackendConceptStatus,
  CreateConceptBody,
  CreateConceptResponse,
  TransitionConceptStatusBody,
  TransitionConceptStatusResponse,
  UpdateConceptBody,
  UpdateConceptResponse,
  ConceptDeleteResponse,
} from '@/models/topics/topics-model';
import { baseService } from '@/services/core/base-service';
import {
  CONCEPTS_URL,
  CONCEPT_DETAIL_URL,
  CONCEPT_STATUS_URL,
} from '@/utils/constants/api-end-points';

export const topicsService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    getConcepts: builder.query<ConceptListResponse, ConceptListParams | void>({
      query: (params) => ({
        url: CONCEPTS_URL,
        method: 'GET',
        params: params
          ? {
              status: params.status,
              search: params.search,
              category_id: params.category_id,
              page: params.page,
              limit: params.limit,
            }
          : undefined,
      }),
      transformResponse: (response: unknown): ConceptListResponse => {
        if (!response || typeof response !== 'object') {
          return { concepts: [], total: 0 };
        }

        const res = response as Record<string, unknown>;

        // 1. Mock format: { concepts: [...], total }
        if (Array.isArray(res.concepts)) {
          return {
            concepts: res.concepts as Concept[],
            total: typeof res.total === 'number' ? res.total : res.concepts.length,
          };
        }

        // 2. Live API format: { data: [...], meta: { total, ... } }
        if (Array.isArray(res.data)) {
          const concepts: Concept[] = res.data.map((item: Record<string, unknown>) => {
            const metadata = (item.metadata as Record<string, unknown>) ?? {};
            return {
              id: String(item.id ?? ''),
              title: String(item.title ?? ''),
              category: String(metadata.category_name ?? item.category_name ?? item.category ?? 'General'),
              description: String(item.brief ?? item.description ?? ''),
              status: normalizeConceptStatus(item.status),
              icon: String(metadata.icon ?? item.icon ?? '✦'),
              opensOn: item.open_date ? String(item.open_date).slice(0, 10) : String(item.opensOn ?? ''),
              closesOn: item.close_date ? String(item.close_date).slice(0, 10) : String(item.closesOn ?? ''),
              reward: item.reward_budget
                ? (String(item.reward_budget).startsWith('৳') || String(item.reward_budget).startsWith('$')
                    ? String(item.reward_budget)
                    : `৳${Number(item.reward_budget).toLocaleString('en-US')}`)
                : String(item.reward ?? '৳0'),
              categoryId: item.category_id ? String(item.category_id) : undefined,
              openDate: item.open_date ? String(item.open_date) : undefined,
              closeDate: item.close_date ? String(item.close_date) : undefined,
            };
          });

          const meta = res.meta as Record<string, unknown> | undefined;
          const total = typeof meta?.total === 'number' ? meta.total : concepts.length;

          return { concepts, total };
        }

        return { concepts: [], total: 0 };
      },
      providesTags: ['concepts'],
    }),
    getConcept: builder.query<{ concept: ConceptDetail }, string>({
      query: (id) => ({ url: CONCEPT_DETAIL_URL(id), method: 'GET' }),
      transformResponse: (response: unknown): { concept: ConceptDetail } => {
        if (!response || typeof response !== 'object') {
          throw new Error('Concept not found');
        }

        const res = response as Record<string, unknown>;

        // 1. Mock format: { concept: ... }
        if (res.concept && typeof res.concept === 'object') {
          return response as { concept: ConceptDetail };
        }

        // 2. Live API format: SerializedConcept
        const metadata = (res.metadata as Record<string, unknown>) ?? {};
        const concept: ConceptDetail = {
          id: String(res.id ?? ''),
          title: String(res.title ?? ''),
          category: String(metadata.category_name ?? res.category_name ?? res.category ?? 'General'),
          description: String(res.brief ?? res.description ?? ''),
          status: normalizeConceptStatus(res.status),
          icon: String(metadata.icon ?? res.icon ?? '✦'),
          opensOn: res.open_date ? String(res.open_date).slice(0, 10) : String(res.opensOn ?? ''),
          closesOn: res.close_date ? String(res.close_date).slice(0, 10) : String(res.closesOn ?? ''),
          reward: res.reward_budget ? `$${res.reward_budget}` : String(res.reward ?? '$0'),
          openDate: res.open_date ? String(res.open_date) : undefined,
          closeDate: res.close_date ? String(res.close_date) : undefined,
          categoryId: res.category_id ? String(res.category_id) : undefined,
          rewardGuidance: typeof res.reward_budget === 'string' ? `$${res.reward_budget}` : undefined,
        };

        return { concept };
      },
      providesTags: (_r, _e, id) => [{ type: 'concepts', id }],
    }),
    createConcept: builder.mutation<CreateConceptResponse, CreateConceptBody>({
      query: (body) => ({
        url: CONCEPTS_URL,
        method: 'POST',
        body: toApiCreateBody(body),
      }),
      invalidatesTags: ['concepts', 'categories'],
    }),
    updateConcept: builder.mutation<
      UpdateConceptResponse,
      { id: string; body: UpdateConceptBody }
    >({
      query: ({ id, body }) => ({
        url: CONCEPT_DETAIL_URL(id),
        method: 'PATCH',
        body: toApiUpdateBody(body),
      }),
      invalidatesTags: ['concepts', 'categories'],
    }),
    transitionConceptStatus: builder.mutation<
      TransitionConceptStatusResponse,
      { id: string; body: TransitionConceptStatusBody }
    >({
      query: ({ id, body }) => ({
        url: CONCEPT_STATUS_URL(id),
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['concepts', 'categories'],
    }),
    deleteConcept: builder.mutation<ConceptDeleteResponse, string>({
      query: (id) => ({
        url: CONCEPT_DETAIL_URL(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['concepts', 'categories'],
    }),
  }),
});

export const {
  useGetConceptsQuery,
  useGetConceptQuery,
  useLazyGetConceptQuery,
  useCreateConceptMutation,
  useUpdateConceptMutation,
  useTransitionConceptStatusMutation,
  useDeleteConceptMutation,
} = topicsService;

// =====================================================================
// Wire-shape translators
// =====================================================================
//
// The admin form (`features/topics/create-concept-dialog.tsx`) speaks a
// presentation-level shape: human-readable category name, "27 Aug" dates,
// "৳3,000" rewards, FE status enum. The backend DTO wants UUIDs, ISO
// dates, plain numbers, and the BE status enum. These helpers bridge the
// two. Pure functions — unit-tested via `topics-service.spec.ts`.

const MONTH_INDEX: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

/**
 * Parse "27 Aug" / "27 Aug 2026" / "27/08/2026" → ISO `YYYY-MM-DD`.
 * Returns `undefined` for blank / unparseable input.
 */
export function parseConceptDate(input: string | undefined): string | undefined {
  if (!input) return '';
  const trimmed = input.trim();
  if (!trimmed) return '';

  // 1. "27 Aug" / "27 Aug 2026"
  const named = /^(\d{1,2})\s+([A-Za-z]{3,9})(?:\s+(\d{4}))?$/.exec(trimmed);
  if (named) {
    const day = Number(named[1]);
    const monthKey = named[2].slice(0, 3).toLowerCase();
    const month = MONTH_INDEX[monthKey];
    if (month === undefined || day < 1 || day > 31) return '';
    const year = named[3] ? Number(named[3]) : new Date().getFullYear();
    const d = new Date(Date.UTC(year, month, day));
    if (Number.isNaN(d.getTime())) return '';
    return d.toISOString().slice(0, 10);
  }

  // 2. ISO `YYYY-MM-DD` already
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

  // 3. Last resort — `new Date(...)` for any other locale format.
  const d = new Date(trimmed);
  if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  return '';
}

/**
 * Strip currency glyphs / commas and parse to a number. Returns 0 for
 * blank / NaN. Handles `"$3000"`, `"৳3,000"`, `"33333"`, `" 33 333.50 "`.
 */
export function parseReward(input: string | undefined): number {
  if (!input) return 0;
  const cleaned = input.replace(/[^\d.-]/g, '');
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Safely parse incoming backend status to the frontend ConceptStatus enum.
 * Maps legacy 'published' -> 'active' and 'closed' -> 'archived'.
 */
export function normalizeConceptStatus(raw: unknown): ConceptStatus {
  if (raw === 'published') return 'active';
  if (raw === 'closed') return 'archived';
  if (
    raw === 'draft' ||
    raw === 'scheduled' ||
    raw === 'active' ||
    raw === 'archived'
  ) {
    return raw;
  }
  return 'active';
}

/**
 * Map the FE `ConceptStatus` enum to the BE `BackendConceptStatus` enum.
 * Frontend and backend statuses are now fully aligned:
 *   draft     → draft
 *   scheduled → scheduled
 *   active    → active
 *   archived  → archived
 */
export function mapStatusForBackend(
  status: ConceptStatus,
): BackendConceptStatus {
  return status;
}

/**
 * Translate the SPA `CreateConceptBody` to the wire payload expected by
 * `POST /admin/concepts` (DTO: `CreateConceptSchema`).
 *
 * The hook layer sets `categoryId` after looking up the chosen FE category
 * name in the `/admin/categories` cache. If `categoryId` is missing (e.g.
 * a mock handler that doesn't care about it), we fall back to a sentinel
 * "unknown" UUID so the mock pipeline still validates the rest of the
 * payload. In the live path, missing `categoryId` would 422 — the hook
 * catches that earlier with a clearer validation message.
 */
export function toApiCreateBody(input: CreateConceptBody): ApiCreateConceptBody {
  const openDate = parseConceptDate(input.opensOn);
  const closeDate = parseConceptDate(input.closesOn);
  const body: ApiCreateConceptBody = {
    category_id:
      input.categoryId && input.categoryId.length > 0
        ? input.categoryId
        : '00000000-0000-0000-0000-000000000000',
    title: input.title,
    brief: input.description,
    reward_budget: parseReward(input.reward),
    status: mapStatusForBackend(input.status),
    metadata: { icon: input.icon || '✦' },
  };
  if (openDate) body.open_date = `${openDate}T00:00:00.000Z`;
  if (closeDate) body.close_date = `${closeDate}T00:00:00.000Z`;
  return body;
}

/**
 * Same translation for `PATCH /admin/concepts/:id`. Every field is optional
 * on both sides — only the ones the user actually edited show up on the
 * wire.
 */
export function toApiUpdateBody(
  input: UpdateConceptBody,
): ApiUpdateConceptBody {
  const body: ApiUpdateConceptBody = {};
  if (input.title !== undefined) body.title = input.title;
  if (input.categoryId) body.category_id = input.categoryId;
  if (input.description !== undefined) body.brief = input.description;
  if (input.icon !== undefined) body.metadata = { icon: input.icon || '✦' };
  if (input.reward !== undefined) body.reward_budget = parseReward(input.reward);
  if (input.status !== undefined) body.status = mapStatusForBackend(input.status);
  if (input.opensOn !== undefined) {
    const openDate = parseConceptDate(input.opensOn);
    body.open_date = openDate ? `${openDate}T00:00:00.000Z` : undefined;
  }
  if (input.closesOn !== undefined) {
    const closeDate = parseConceptDate(input.closesOn);
    body.close_date = closeDate ? `${closeDate}T00:00:00.000Z` : undefined;
  }
  return body;
}

// Exported for unit tests.
export const __testing = {
  parseConceptDate,
  parseReward,
  mapStatusForBackend,
  normalizeConceptStatus,
  toApiCreateBody,
  toApiUpdateBody,
};