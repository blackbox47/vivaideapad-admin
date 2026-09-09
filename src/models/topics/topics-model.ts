export const CONCEPT_STATUSES = [
  'draft',
  'active',
  'archived',
] as const;

export type ConceptStatus = (typeof CONCEPT_STATUSES)[number];

export const CATEGORY_ICON_CHOICES = [
  '✦',
  '✎',
  '⚑',
  '☾',
  '✺',
  '⚐',
  '◇',
  '★',
  '✿',
  '⬢',
] as const;

export interface ConceptCategory {
  name: string;
  icon: string;
}

export interface Concept {
  id: string;
  title: string;
  category: string;
  description: string;
  status: ConceptStatus;
  icon: string;
  opensOn: string;
  closesOn: string;
  reward: string;
  categoryId?: string;
  openDate?: string;
  closeDate?: string;
  forNewUsers?: boolean;
  isOnboarding?: boolean;
}

export interface ConceptListParams {
  status?: ConceptStatus | 'all';
  search?: string;
  category_id?: string;
  page?: number;
  limit?: number;
}

export interface ConceptListResponse {
  concepts: Concept[];
  total: number;
}

export interface CreateConceptBody {
  title: string;
  category: string;
  icon: string;
  description: string;
  opensOn: string;
  closesOn: string;
  reward: string;
  status: ConceptStatus;
  isOnboarding?: boolean;
  /**
   * Resolved UUID of the chosen category. Set by `useCreateConcept` after
   * looking the category up via GET /admin/categories. Optional for
   * backward-compat with mock handlers, but required by the live API.
   */
  categoryId?: string;
}

/**
 * Wire payload for `POST /admin/concepts` — matches
 * `vivaideapad-api/src/admin/concepts/dto/concepts.dto.ts:CreateConceptSchema`.
 * Built by `toApiCreateBody` in `services/topics/topics-service.ts`.
 */
export interface ApiCreateConceptBody {
  category_id: string;
  title: string;
  brief: string;
  reward_budget: number;
  is_onboarding?: boolean;
  status: BackendConceptStatus;
  open_date?: string;
  close_date?: string;
  metadata: { icon: string };
}

/** Mirror of `CONCEPT_STATUSES` on the backend (`concept.entity.ts:11`). */
export const BACKEND_CONCEPT_STATUSES = [
  'draft',
  'active',
  'archived',
] as const;
export type BackendConceptStatus =
  (typeof BACKEND_CONCEPT_STATUSES)[number];

export interface CreateConceptResponse {
  concept: Concept;
  createdAt: string;
}

// ── Spec-aligned additions (REST spec §5.3) ──────────────────────────────

export interface ConceptDetail extends Concept {
  /** ISO timestamps for the open/close window. */
  openDate?: string;
  closeDate?: string;
  categoryId?: string;
  /** Reward guidance text. */
  rewardGuidance?: string;
}

export interface UpdateConceptBody {
  title?: string;
  category?: string;
  description?: string;
  icon?: string;
  opensOn?: string;
  closesOn?: string;
  reward?: string;
  status?: ConceptStatus;
  isOnboarding?: boolean;
  categoryId?: string;
}

/**
 * Wire payload for `PATCH /admin/concepts/:id` — same shape as
 * `ApiCreateConceptBody` but every field optional.
 */
export interface ApiUpdateConceptBody {
  category_id?: string;
  title?: string;
  brief?: string;
  reward_budget?: number;
  is_onboarding?: boolean;
  status?: BackendConceptStatus;
  open_date?: string;
  close_date?: string;
  metadata?: { icon: string };
}

export interface UpdateConceptResponse {
  concept: Concept;
  updatedAt: string;
}

export interface TransitionConceptStatusBody {
  status: ConceptStatus;
}

export interface TransitionConceptStatusResponse {
  id: string;
  status: ConceptStatus;
  transitionedAt: string;
}

export interface ConceptDeleteResponse {
  id: string;
  deletedAt: string;
}

export type BulkConceptActionType =
  | 'set_status'
  | 'set_for_new_users'
  | 'set_is_onboarding'
  | 'remove_is_onboarding'
  | 'duplicate'
  | 'delete';

export interface BulkConceptActionBody {
  action: BulkConceptActionType;
  ids: string[];
  status?: ConceptStatus;
  for_new_users?: boolean;
  is_onboarding?: boolean;
}

export interface BulkConceptActionResponse {
  success: boolean;
  affected: number;
  duplicated?: unknown[];
}
