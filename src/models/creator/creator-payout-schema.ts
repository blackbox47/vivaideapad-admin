import { z } from 'zod';

export const changePayoutMethodSchema = z.object({
  method: z.string().min(1, 'Payout method is required.'),
});

export type ChangePayoutMethodFormValues = z.infer<
  typeof changePayoutMethodSchema
>;

export const withdrawRequestSchema = z.object({
  amount: z
    .string()
    .trim()
    .min(1, 'Amount is required.')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Amount must be a positive number.',
    }),
  method: z.string().min(1, 'Payout method is required.'),
  mobile: z
    .string()
    .trim()
    .min(1, 'Mobile number is required.')
    .regex(/^[0-9+\s\-()]{7,20}$/, 'Enter a valid mobile number.'),
});

export type WithdrawRequestFormValues = z.infer<typeof withdrawRequestSchema>;
