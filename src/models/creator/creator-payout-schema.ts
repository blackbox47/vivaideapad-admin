import { z } from 'zod';

import { isBdMobileNumber } from '@/utils/helpers/bd-mobile';

export const changePayoutMethodSchema = z.object({
  method: z.literal('bKash'),
  mobile: z
    .string()
    .trim()
    .min(1, 'Mobile number is required.')
    .refine((value) => isBdMobileNumber(value), {
      message: 'Enter a valid Bangladeshi mobile number.',
    }),
});

export type ChangePayoutMethodFormValues = z.infer<
  typeof changePayoutMethodSchema
>;

export function parseAvailableBalance(available: string): number {
  const cleaned = available.replace(/[^0-9.]/g, '');
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function createWithdrawRequestSchema(availableAmount: number) {
  return z.object({
    amount: z
      .string()
      .trim()
      .min(1, 'Amount is required.')
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'Amount must be a positive number.',
      })
      .refine((val) => Number(val) <= availableAmount, {
        message: 'Amount cannot exceed your available balance.',
      }),
    method: z.literal('bKash'),
    mobile: z
      .string()
      .trim()
      .min(1, 'Mobile number is required.')
      .regex(/^[0-9+\s\-()]{7,20}$/, 'Enter a valid mobile number.'),
  });
}

export type WithdrawRequestFormValues = z.infer<
  ReturnType<typeof createWithdrawRequestSchema>
>;
