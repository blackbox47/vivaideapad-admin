import { z } from 'zod';

import { isBdMobileNumber } from '@/utils/helpers/bd-mobile';
import { CURRENCY_SYMBOL, MIN_WITHDRAWAL_AMOUNT } from '@/utils/constants';

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
  const trimmed = available.trim();
  if (!trimmed || trimmed === '—') {
    return 0;
  }

  // Formats we see: "৳ -3000", "Tk -3,000", "-৳ 3000", "−3000", "3000".
  const normalized = trimmed.replace(/,/g, '').replace(/[−–—]/g, '-');
  const firstDigitIndex = normalized.search(/\d/);
  if (firstDigitIndex < 0) {
    return 0;
  }

  const isNegative = normalized.slice(0, firstDigitIndex).includes('-');
  const match = normalized.slice(firstDigitIndex).match(/^\d+(?:\.\d+)?/);
  if (!match) {
    return 0;
  }

  const parsed = Number(match[0]);
  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return isNegative ? -parsed : parsed;
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
      .refine((val) => Number(val) >= MIN_WITHDRAWAL_AMOUNT, {
        message: `Minimum withdrawal is ${CURRENCY_SYMBOL}${MIN_WITHDRAWAL_AMOUNT}.`,
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
