import { useState } from 'react';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type {
  ContentSubmission,
  SubmissionStatus,
} from '@/models/content-review/content-review-model';

interface SubmissionReviewPanelProps {
  submission: ContentSubmission;
  isDeciding: boolean;
  onClose: () => void;
  onDecide: (status: SubmissionStatus, comment: string) => void;
}

export default function SubmissionReviewPanel({
  submission,
  isDeciding,
  onClose,
  onDecide,
}: SubmissionReviewPanelProps) {
  const [comment, setComment] = useState('');
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  const handleDecide = (status: SubmissionStatus) => {
    const trimmed = comment.trim();
    const needsComment =
      status === 'Rejected' || status === 'Revision Requested';

    if (needsComment && trimmed.length === 0) {
      setFeedbackError(
        'Add reviewer notes before requesting a revision or rejecting.',
      );
      return;
    }

    setFeedbackError(null);
    onDecide(status, trimmed);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-(--overlay-scrim) p-5 backdrop-blur-xs">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="content-review-title"
        className="max-h-[90vh] w-full max-w-140 overflow-auto rounded-[24px] border border-(--dialog-border) bg-card p-7 shadow-2xl"
      >
        <div className="mb-3.5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold tracking-[0.12em] text-brand-sage uppercase">
              Content review
            </p>
            <h2
              id="content-review-title"
              className="mt-1.5 font-heading text-[22px] tracking-display text-foreground"
            >
              {submission.title}
            </h2>
          </div>
          <button
            type="button"
            className="text-[22px] leading-none text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Close review"
            onClick={onClose}
          >
            <X />
          </button>
        </div>

        <div className="mb-3.5 flex gap-3.5 text-xs text-muted-foreground">
          <span>{submission.contributor}</span>·<span>{submission.topic}</span>·
          <span>{submission.submitted}</span>
        </div>

        <div className="mb-3.5 flex flex-wrap gap-2.5">
          <span
            className={
              submission.risk === 'High'
                ? 'rounded-full bg-danger-subtle px-3 py-1.5 text-xs font-bold text-danger'
                : submission.risk === 'Medium'
                  ? 'rounded-full bg-warning-subtle px-3 py-1.5 text-xs font-bold text-warning'
                  : 'rounded-full bg-success-subtle px-3 py-1.5 text-xs font-bold text-success'
            }
          >
            AI risk: {submission.risk}
          </span>
          <span className="rounded-full bg-surface-muted px-3 py-1.5 text-xs font-bold text-muted-foreground">
            {submission.approvedCount} approved · {submission.approvalRate}{' '}
            approval rate
          </span>
        </div>

        <p className="rounded-[14px] bg-surface-subtle p-4 text-sm leading-[1.7] text-foreground">
          {submission.body}
        </p>
        <p className="mt-2 mb-4 text-xs text-text-subtle">
          AI-assisted indicators are advisory only — the reviewer makes the
          final decision.
        </p>

        <Textarea
          id="content-reviewer-comment"
          label="Feedback to contributor"
          value={comment}
          onChange={(event) => {
            setComment(event.target.value);
            setFeedbackError(null);
          }}
          placeholder="Add reviewer notes (optional for approval, required for revision or rejection)"
          className="min-h-17.5"
          errorMessage={feedbackError}
        />

        <div className="mt-4.5 flex flex-wrap justify-end gap-2.5">
          <Button
            type="button"
            disabled={isDeciding}
            loading={isDeciding}
            className="h-auto shrink-0 whitespace-nowrap rounded-full border border-danger-subtle bg-card px-4 py-3 text-[13px] font-bold text-danger hover:bg-danger-subtle transition-colors disabled:opacity-60"
            onClick={() => handleDecide('Rejected')}
          >
            Reject
          </Button>
          <Button
            type="button"
            disabled={isDeciding}
            loading={isDeciding}
            className="h-auto shrink-0 whitespace-nowrap rounded-full border border-border bg-card px-4 py-3 text-[13px] font-bold text-foreground hover:bg-surface-subtle transition-colors disabled:opacity-60"
            onClick={() => handleDecide('Revision Requested')}
          >
            Request revision
          </Button>
          <Button
            type="button"
            disabled={isDeciding}
            loading={isDeciding}
            className="h-auto shrink-0 whitespace-nowrap rounded-full bg-primary px-4 py-3 text-[13px] font-bold text-primary-foreground hover:bg-brand-forest transition-colors disabled:opacity-60"
            onClick={() => handleDecide('Approved')}
          >
            Approve & assign reward
          </Button>
        </div>
      </div>
    </div>
  );
}
