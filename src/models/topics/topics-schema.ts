import { startOfDay } from 'date-fns';
import { z } from 'zod';

function parseRewardAmount(value: string): number {
  const cleaned = value.replace(/[^\d.]/g, '');
  return Number(cleaned);
}

/**
 * Keep only a positive numeric string (digits and at most one decimal point).
 * Used so the reward field cannot accept letters, signs, or extra punctuation.
 */
export function sanitizeRewardAmountInput(value: string): string {
  const cleaned = value.replace(/[^\d.]/g, '');
  const decimalIndex = cleaned.indexOf('.');
  if (decimalIndex === -1) {
    return cleaned;
  }

  return `${cleaned.slice(0, decimalIndex + 1)}${cleaned
    .slice(decimalIndex + 1)
    .replace(/\./g, '')}`;
}

const rewardAmountSchema = z
  .string()
  .trim()
  .refine((value) => {
    const amount = parseRewardAmount(value);
    return Number.isFinite(amount) && amount > 0;
  }, 'Reward amount must be greater than 0');

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
  opensOn: z.date({ error: 'Opening date is required.' }),
  closesOn: z.date().optional(),
  reward: rewardAmountSchema,
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
  opensOn: z.date({ error: 'Opening date is required.' }),
  closesOn: z.date().optional(),
  reward: rewardAmountSchema,
  isOnboarding: z.boolean().optional(),
  status: z.enum(['draft', 'active', 'archived']),
}).superRefine(refineClosingDate);

export type EditConceptFormValues = z.infer<typeof editConceptSchema>;
