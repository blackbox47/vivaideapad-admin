import { useState } from 'react';

import StatusBadge from '@/components/shared/status-badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Applicant, ApplicantStatus } from '@/models/people/people-model';

interface ApplicantReviewPanelProps {
  applicant: Applicant;
  isDeciding: boolean;
  onClose: () => void;
  onDecide: (status: ApplicantStatus, comment: string) => void;
}

export default function ApplicantReviewPanel({
  applicant,
  isDeciding,
  onClose,
  onDecide,
}: ApplicantReviewPanelProps) {
  const [comment, setComment] = useState('');

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-(--overlay-scrim) p-5 backdrop-blur-xs">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="applicant-review-title"
        className="max-h-[90vh] w-full max-w-140 overflow-auto rounded-[24px] border border-(--dialog-border) bg-card p-7 shadow-2xl"
      >
        <div className="mb-3.5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold tracking-[0.12em] text-brand-sage uppercase">
              Applicant review
            </p>
            <h2
              id="applicant-review-title"
              className="mt-1.5 font-heading text-[22px] tracking-display text-foreground"
            >
              {applicant.title}
            </h2>
          </div>
          <button
            type="button"
            className="text-[22px] leading-none text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Close review"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="mb-3.5 grid grid-cols-2 gap-2.5 rounded-[14px] bg-surface-subtle p-4 text-[13px]">
          <div>
            <span className="mb-0.5 block text-[11px] text-muted-foreground">
              Applicant
            </span>
            <strong className="text-foreground">{applicant.name}</strong>
          </div>
          <div>
            <span className="mb-0.5 block text-[11px] text-muted-foreground">Email</span>
            <strong className="text-foreground">{applicant.email}</strong>
          </div>
          <div>
            <span className="mb-0.5 block text-[11px] text-muted-foreground">
              Applied for
            </span>
            <strong className="text-foreground">{applicant.topic}</strong>
          </div>
          <div>
            <span className="mb-0.5 block text-[11px] text-muted-foreground">
              Submitted
            </span>
            <strong className="text-foreground">{applicant.submitted}</strong>
          </div>
          <div>
            <span className="mb-0.5 block text-[11px] text-muted-foreground">Source</span>
            <strong className="text-foreground">Website signup</strong>
          </div>
          <div>
            <span className="mb-0.5 block text-[11px] text-muted-foreground">Status</span>
            <StatusBadge status={applicant.status} />
          </div>
        </div>

        <span className="mb-1.5 block text-xs font-bold text-foreground">Submitted concept</span>
        <p className="rounded-[14px] bg-surface-subtle p-4 text-sm leading-[1.7] text-foreground">
          {applicant.body}
        </p>

        <label className="my-3.5 flex items-start gap-2 text-xs text-muted-foreground">
          <Input type="checkbox" defaultChecked disabled className="accent-primary" />
          Applicant confirmed originality and accepted content guidelines.
        </label>

        <Textarea
          id="reviewer-comment"
          label="Reviewer comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Required if requesting revision or rejecting"
          className="min-h-15"
        />
        <p className="mt-2.5 text-xs text-muted-foreground">
          Approving grants this applicant contributor portal access. They will
          appear under Invited until they sign in and submit against a live task.
        </p>

        <div className="mt-4.5 flex flex-wrap justify-end gap-2.5">
          <button
            type="button"
            disabled={isDeciding}
            className="rounded-full border border-danger-subtle bg-card px-4.5 py-3 font-bold text-danger hover:bg-danger-subtle transition-colors disabled:opacity-60 cursor-pointer"
            onClick={() => onDecide('Rejected', comment)}
          >
            Reject
          </button>
          <button
            type="button"
            disabled={isDeciding}
            className="rounded-full border border-border bg-card px-4.5 py-3 font-bold text-foreground hover:bg-surface-subtle transition-colors disabled:opacity-60 cursor-pointer"
            onClick={() => onDecide('Revision Requested', comment)}
          >
            Request revision
          </button>
          <button
            type="button"
            disabled={isDeciding}
            className="rounded-full bg-primary px-4.5 py-3 font-bold text-primary-foreground hover:bg-brand-forest transition-colors disabled:opacity-60 cursor-pointer"
            onClick={() => onDecide('Approved', comment)}
          >
            Approve applicant
          </button>
        </div>
      </div>
    </div>
  );
}
