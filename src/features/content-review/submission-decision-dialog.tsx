import { useState } from 'react';

import { Button } from '@/components/ui/button';
import type {
  SubmissionDecisionAction,
  SubmissionDecisionBody,
} from '@/models/content-review/content-review-model';
import { getApiErrorMessage } from '@/utils/helpers/api-error';

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
  const [decision, setDecision] = useState<ActionChoice>('approve');
  const [feedback, setFeedback] = useState('');
  const [rewardAmount, setRewardAmount] = useState('1000');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const handleDecide = async () => {
    setSubmitError(null);
    if (decision === 'request_revision' && feedback.trim().length === 0) {
      setSubmitError('Please leave feedback before requesting a revision.');
      return;
    }
    if (decision === 'reject' && feedback.trim().length === 0) {
      setSubmitError('Please leave feedback before rejecting.');
      return;
    }
    const trimmedReward = rewardAmount.trim();
    const body: SubmissionDecisionBody = {
      decision,
      feedback: feedback.trim() || undefined,
    };
    if (decision === 'approve') {
      const reward = Number(trimmedReward);
      if (!Number.isFinite(reward) || reward <= 0) {
        setSubmitError('Reward amount must be a positive number.');
        return;
      }
      body.reward_amount = reward;
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

        <div className="space-y-4">
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
                    onClick={() => setDecision(choice)}
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
          </div>

          {decision === 'approve' && (
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Reward amount (৳)
              </label>
              <input
                type="number"
                min={1}
                value={rewardAmount}
                onChange={(event) => setRewardAmount(event.target.value)}
                className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
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
            <textarea
              value={feedback}
              onChange={(event) => setFeedback(event.target.value)}
              rows={4}
              placeholder="Reviewer notes shared with the contributor…"
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-2">
            {onScanRisk && (
              <Button
                variant="ghost"
                onClick={handleScan}
                disabled={scanning || isDeciding}
              >
                {scanning ? 'Scanning…' : 'Risk scan'}
              </Button>
            )}
            {onPublish && (
              <Button
                variant="ghost"
                onClick={handlePublish}
                disabled={publishing || isDeciding}
              >
                {publishing ? 'Publishing…' : 'Publish'}
              </Button>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose} disabled={isDeciding}>
              Cancel
            </Button>
            <Button
              onClick={handleDecide}
              disabled={isDeciding}
              className={ACTION_TONE[decision]}
            >
              {isDeciding ? 'Saving…' : `Confirm: ${ACTION_LABELS[decision]}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}