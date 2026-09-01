import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type {
  SubmissionDecisionAction,
  SubmissionDecisionBody,
} from '@/models/content-review/content-review-model';
import { getApiErrorMessage } from '@/utils/helpers/api-error';

const submissionDecisionSchema = z
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

type SubmissionDecisionFormValues = z.infer<typeof submissionDecisionSchema>;

interface SubmissionDecisionDialogProps {
  submissionId: string;
  submissionTitle: string;
  isDeciding: boolean;
  error?: string | null;
  onClose: () => void;
  onDecide: (id: string, body: SubmissionDecisionBody) => Promise<unknown>;
  onScanRisk?: (id: string) => Promise<unknown>;
  onPublish?: (id: string) => Promise<unknown>;
}

type ActionChoice = SubmissionDecisionAction;

const ACTION_LABELS: Record<ActionChoice, string> = {
  approve: 'Approve',
  request_revision: 'Request revision',
  reject: 'Reject',
};

const ACTION_TONE: Record<ActionChoice, string> = {
  approve: 'bg-emerald-600 text-white hover:bg-emerald-700',
  request_revision: 'bg-amber-500 text-white hover:bg-amber-600',
  reject: 'bg-rose-600 text-white hover:bg-rose-700',
};

export default function SubmissionDecisionDialog({
  submissionId,
  submissionTitle,
  isDeciding,
  error,
  onClose,
  onDecide,
  onScanRisk,
  onPublish,
}: SubmissionDecisionDialogProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SubmissionDecisionFormValues>({
    resolver: zodResolver(submissionDecisionSchema),
    defaultValues: {
      decision: 'approve',
      rewardAmount: '1000',
      feedback: '',
    },
  });

  const decision = watch('decision');

  const onFormSubmit = async (values: SubmissionDecisionFormValues) => {
    setSubmitError(null);
    const body: SubmissionDecisionBody = {
      decision: values.decision,
      feedback: values.feedback?.trim() || undefined,
    };
    if (values.decision === 'approve') {
      body.reward_amount = Number(values.rewardAmount?.trim());
    }
    try {
      await onDecide(submissionId, body);
      onClose();
    } catch (err) {
      setSubmitError(getApiErrorMessage(err));
    }
  };

  const handleScan = async () => {
    if (!onScanRisk) return;
    setScanning(true);
    try {
      await onScanRisk(submissionId);
    } finally {
      setScanning(false);
    }
  };

  const handlePublish = async () => {
    if (!onPublish) return;
    setPublishing(true);
    try {
      await onPublish(submissionId);
      onClose();
    } catch (err) {
      setSubmitError(getApiErrorMessage(err));
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-5 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        className="max-h-[90vh] w-full max-w-[560px] overflow-auto rounded-2xl border bg-card p-7 shadow-2xl"
      >
        <div className="mb-3">
          <p className="text-xs font-semibold tracking-wider text-emerald-700 uppercase">
            Spec-aligned decision
          </p>
          <h3 className="text-lg font-semibold">{submissionTitle}</h3>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} noValidate className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Decision
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {(Object.keys(ACTION_LABELS) as ActionChoice[]).map(
                (choice) => (
                  <button
                    key={choice}
                    type="button"
                    onClick={() => setValue('decision', choice)}
                    className={
                      'rounded-md border px-3 py-1.5 text-sm font-medium transition ' +
                      (decision === choice
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-input bg-background hover:bg-muted')
                    }
                  >
                    {ACTION_LABELS[choice]}
                  </button>
                ),
              )}
            </div>
            {errors.decision?.message ? (
              <p className="mt-1.5 text-xs text-destructive" role="alert">
                {errors.decision.message}
              </p>
            ) : null}
          </div>

          {decision === 'approve' && (
            <div>
              <Input
                label="Reward amount (৳)"
                type="number"
                min={1}
                errorMessage={errors.rewardAmount?.message}
                {...register('rewardAmount')}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                This will be appended to the contributor's wallet ledger as a
                reward credit.
              </p>
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Feedback
            </label>
            <Textarea
              rows={4}
              placeholder="Reviewer notes shared with the contributor…"
              className="mt-1"
              errorMessage={errors.feedback?.message}
              {...register('feedback')}
            />
          </div>

          {submitError && (
            <p className="text-xs text-rose-600">{submitError}</p>
          )}
          {error && !submitError && (
            <p className="text-xs text-rose-600">
              {getApiErrorMessage(error)}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
            <div className="flex gap-2">
              {onScanRisk && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleScan}
                  disabled={scanning || isDeciding}
                >
                  {scanning ? 'Scanning…' : 'Risk scan'}
                </Button>
              )}
              {onPublish && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handlePublish}
                  disabled={publishing || isDeciding}
                >
                  {publishing ? 'Publishing…' : 'Publish'}
                </Button>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={onClose} disabled={isDeciding}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isDeciding}
                className={ACTION_TONE[decision]}
              >
                {isDeciding ? 'Saving…' : `Confirm: ${ACTION_LABELS[decision]}`}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}