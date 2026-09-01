import { z } from 'zod';

export function parseAdjustmentAmount(raw: string): number | null {
  const match = raw.trim().replace(/,/g, '').match(/^([+-])?\s*(\d+)$/);
  if (!match) {
    return null;
  }

  const value = Number(match[2]);
  if (!Number.isFinite(value) || value === 0) {
    return null;
  }

  return match[1] === '-' ? -value : value;
}

export const balanceAdjustmentSchema = z.object({
  contributor: z.string().trim().min(1, 'Contributor is required.'),
  amount: z
    .string()
    .trim()
    .min(1, 'Amount is required.')
    .refine(
      (raw) => parseAdjustmentAmount(raw) !== null,
      'Enter a non-zero amount such as -20 or +50.',
    ),
  reason: z.string().trim().min(1, 'Reason is required.'),
});

export type BalanceAdjustmentFormValues = z.infer<
  typeof balanceAdjustmentSchema
>;
