import { z } from 'zod';

export const changePayoutMethodSchema = z.object({
  method: z.enum(['bKash', 'Nagad', 'Rocket', 'Bank']),
});

export type ChangePayoutMethodFormValues = z.infer<
  typeof changePayoutMethodSchema
>;

export const withdrawRequestSchema = z.object({
  amount: z.string().trim().min(1, 'Amount is required.'),
  method: z.string().min(1, 'Payout method is required.'),
});

export type WithdrawRequestFormValues = z.infer<typeof withdrawRequestSchema>;
