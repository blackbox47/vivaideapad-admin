import { startOfDay } from 'date-fns';
import { z } from 'zod';

function refineClosingDate(
  data: { opensOn?: Date; closesOn?: Date },
  ctx: z.RefinementCtx,
): void {
  if (!data.opensOn || !data.closesOn) {
    return;
  }
  if (startOfDay(data.closesOn) < startOfDay(data.opensOn)) {
    ctx.addIssue({
      code: 'custom',
      path: ['closesOn'],
      message: 'Closing date cannot be before the opening date.',
    });
  }
}

export const createConceptSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required.')
    .max(255, 'Title must be at most 255 characters.'),
  categoryId: z.string().min(1, 'Pick a category before saving.'),
  description: z
    .string()
    .trim()
    .min(1, 'Description is required.')
    .max(10_000, 'Description must be at most 10,000 characters.'),
  opensOn: z.date().optional(),
  closesOn: z.date().optional(),
  reward: z.string(),
  isOnboarding: z.boolean().optional(),
  status: z.enum(['draft', 'active', 'archived']),
}).superRefine(refineClosingDate);

export type CreateConceptFormValues = z.infer<typeof createConceptSchema>;

export const editConceptSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required.')
    .max(255, 'Title must be at most 255 characters.'),
  categoryId: z.string().min(1, 'Pick a category before saving.'),
  description: z
    .string()
    .trim()
    .min(1, 'Description is required.')
    .max(10_000, 'Description must be at most 10,000 characters.'),
  opensOn: z.date().optional(),
  closesOn: z.date().optional(),
  reward: z.string(),
  isOnboarding: z.boolean().optional(),
  status: z.enum(['draft', 'active', 'archived']),
}).superRefine(refineClosingDate);

export type EditConceptFormValues = z.infer<typeof editConceptSchema>;
