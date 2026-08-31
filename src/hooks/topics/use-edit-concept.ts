import { useCallback, useMemo } from 'react';

import type { UpdateConceptBody } from '@/models/topics/topics-model';
import { useGetCategoriesQuery } from '@/services/categories/categories-service';
import { useUpdateConceptMutation } from '@/services/topics/topics-service';
import type { DropdownOption } from '@/utils/types/dropdown-option';

interface UseEditConceptResult {
  /**
   * Categories for the dropdown in `{ id, label }` shape. `id` is the
   * backend UUID; `label` is the human-readable display (icon + name).
   */
  categories: DropdownOption[];
  /** True while the categories request is in flight. */
  isLoadingCategories: boolean;
  /** True while the update mutation is in flight. */
  isSubmitting: boolean;
  /** The most recent error message from the update mutation (or null). */
  error: string | null;
  /**
   * Submit the form payload. The dialog passes the concept id and chosen category UUID.
   */
  submit: (id: string, body: UpdateConceptBody) => Promise<void>;
  reset: () => void;
}

export default function useEditConcept(): UseEditConceptResult {
  const { data, isLoading } = useGetCategoriesQuery();
  const [update, updateState] = useUpdateConceptMutation();

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
    async (id: string, body: UpdateConceptBody) => {
      if (!body.categoryId) {
        throw new Error(
          'No category selected — pick one from the list before saving.',
        );
      }
      const wireCategory = data?.data?.find((c) => c.id === body.categoryId);
      const icon = wireCategory?.icon || body.icon || '✦';
      await update({
        id,
        body: {
          ...body,
          icon,
          categoryId: body.categoryId,
        },
      }).unwrap();
    },
    [data, update],
  );

  const errorMessage = useMemo<string | null>(() => {
    if (!updateState.error) return null;
    const e = updateState.error as {
      data?: { error?: { message?: string } };
      message?: string;
    };
    return e.data?.error?.message ?? e.message ?? null;
  }, [updateState.error]);

  return {
    categories,
    isLoadingCategories: isLoading,
    isSubmitting: updateState.isLoading,
    error: errorMessage,
    submit,
    reset: updateState.reset,
  };
}
