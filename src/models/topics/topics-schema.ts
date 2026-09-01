import { z } from 'zod';

/** Synthetic id prefix for `+ New category` additions — not a real UUID. */
export const LOCAL_CATEGORY_PREFIX = 'local:';

export const createConceptSchema = z.object({
  title: z.string().trim().min(1, 'Title is required.'),
  categoryId: z
    .string()
    .min(1, 'Pick a category before saving.')
    .refine(
      (id) => !id.startsWith(LOCAL_CATEGORY_PREFIX),
      'Draft category must be saved from the Categories page first.',
    ),
  description: z.string().trim().min(1, 'Description is required.'),
  opensOn: z.date().optional(),
  closesOn: z.date().optional(),
  reward: z.string(),
  status: z.enum(['draft', 'scheduled', 'active', 'archived']),
});

export type CreateConceptFormValues = z.infer<typeof createConceptSchema>;

export const editConceptSchema = z.object({
  title: z.string().trim().min(1, 'Title is required.'),
  categoryId: z
    .string()
    .min(1, 'Pick a category before saving.')
    .refine(
      (id) => !id.startsWith(LOCAL_CATEGORY_PREFIX),
      'Draft category must be saved from the Categories page first.',
    ),
  description: z.string().trim().min(1, 'Description is required.'),
  opensOn: z.date().optional(),
  closesOn: z.date().optional(),
  reward: z.string(),
  status: z.enum(['draft', 'scheduled', 'active', 'archived']),
});

export type EditConceptFormValues = z.infer<typeof editConceptSchema>;
