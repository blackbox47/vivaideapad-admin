import { z } from 'zod';

export const submissionDecisionSchema = z
  .object({
    decision: z.enum(['approve', 'request_revision', 'reject']),
    rewardAmount: z.string().optional(),
    feedback: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.decision === 'request_revision' &&
      (!data.feedback || data.feedback.trim().length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please leave feedback before requesting a revision.',
        path: ['feedback'],
      });
    }
    if (
      data.decision === 'reject' &&
      (!data.feedback || data.feedback.trim().length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please leave feedback before rejecting.',
        path: ['feedback'],
      });
    }
    if (data.decision === 'approve') {
      const reward = Number(data.rewardAmount?.trim());
      if (!Number.isFinite(reward) || reward <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Reward amount must be a positive number.',
          path: ['rewardAmount'],
        });
      }
    }
  });

export type SubmissionDecisionFormValues = z.infer<
  typeof submissionDecisionSchema
>;
