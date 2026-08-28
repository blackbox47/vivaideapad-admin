import { useCallback, useMemo } from 'react';

import type { CreateConceptBody } from '@/models/topics/topics-model';
import { useGetCategoriesQuery } from '@/services/categories/categories-service';
import { useCreateConceptMutation } from '@/services/topics/topics-service';
import type { DropdownOption } from '@/utils/types/dropdown-option';

interface UseCreateConceptResult {
  /**
   * Categories for the dropdown in `{ id, label }` shape. `id` is the
   * backend UUID; `label` is the human-readable display (icon + name).
   * The dialog emits `categoryId` on submit; this hook also looks up the
   * matching category name to keep `CreateConceptBody.category` (the FE
   * display string) populated.
   */
  categories: DropdownOption[];
  /** True while the categories request is in flight. */
  isLoadingCategories: boolean;
  /** True while the create mutation is in flight. */
  isSubmitting: boolean;
  /** The most recent error message from the create mutation (or null). */
  error: string | null;
  /**
   * Submit the form payload. The dialog passes the chosen category UUID
   * via `body.categoryId`. If the dialog somehow submits without it,
   * this rejects with a clear message — the dialog surfaces the error.
   */
  submit: (body: CreateConceptBody) => Promise<void>;
  reset: () => void;
}

export default function useCreateConcept(): UseCreateConceptResult {
  const { data, isLoading } = useGetCategoriesQuery();
  const [create, createState] = useCreateConceptMutation();

  const categories = useMemo<DropdownOption[]>(() => {
    if (!data || !Array.isArray(data.data)) return [];
    return data.data
      .filter((c) => c?.isActive !== false)
      .map((c) => ({
        id: c.id,
        label: `${c.icon || '✦'} ${c.name}`,
      }));
  }, [data]);

  const submit = useCallback(
    async (body: CreateConceptBody) => {
      if (!body.categoryId) {
        throw new Error(
          'No category selected — pick one from the list before saving.',
        );
      }
      // Look up the chosen category in the cached `/admin/categories`
      // list so we can populate `icon` for `metadata.icon` round-trip.
      // The dropdown's `label` is `${icon} ${name}` — we'd rather use the
      // authoritative icon from the cache than split the label string.
      const wireCategory = data?.data?.find((c) => c.id === body.categoryId);
      const icon = wireCategory?.icon || body.icon || '✦';
      await create({ ...body, icon, categoryId: body.categoryId }).unwrap();
      // Listing re-fetch is handled by `invalidatesTags: ['concepts',
      // 'categories']` on the createConcept mutation.
    },
    [data, create],
  );

  const errorMessage = useMemo<string | null>(() => {
    if (!createState.error) return null;
    const e = createState.error as {
      data?: { error?: { message?: string } };
      message?: string;
    };
    return e.data?.error?.message ?? e.message ?? null;
  }, [createState.error]);

  return {
    categories,
    isLoadingCategories: isLoading,
    isSubmitting: createState.isLoading,
    error: errorMessage,
    submit,
    reset: createState.reset,
  };
}
