import { useState } from 'react';

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
    <div className="fixed inset-0 z-50 grid place-items-center bg-[rgba(8,23,18,0.6)] p-5">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="content-review-title"
        className="max-h-[90vh] w-full max-w-[560px] overflow-auto rounded-[24px] bg-white p-7 shadow-[0_20px_60px_rgba(29,65,54,0.12)]"
      >
        <div className="mb-3.5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold tracking-[0.12em] text-[#527065] uppercase">
              Content review
            </p>
            <h2
              id="content-review-title"
              className="mt-1.5 font-heading text-[22px] tracking-[-0.04em] text-foreground"
            >
              {submission.title}
            </h2>
          </div>
          <button
            type="button"
            className="text-[22px] leading-none text-foreground"
            aria-label="Close review"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="mb-3.5 flex gap-3.5 text-xs text-[#687773]">
          <span>{submission.contributor}</span>·<span>{submission.topic}</span>·
          <span>{submission.submitted}</span>
        </div>

        <div className="mb-3.5 flex flex-wrap gap-2.5">
          <span
            className={
              submission.risk === 'High'
                ? 'rounded-full bg-[#ffe6d5] px-3 py-1.5 text-xs font-bold text-[#b3401f]'
                : submission.risk === 'Medium'
                  ? 'rounded-full bg-[#fff5d7] px-3 py-1.5 text-xs font-bold text-[#8a6d00]'
                  : 'rounded-full bg-[#dff8eb] px-3 py-1.5 text-xs font-bold text-[#16805e]'
            }
          >
            AI risk: {submission.risk}
          </span>
          <span className="rounded-full bg-[#eef1ef] px-3 py-1.5 text-xs font-bold text-[#687773]">
            {submission.approvedCount} approved · {submission.approvalRate}{' '}
            approval rate
          </span>
        </div>

        <p className="rounded-[14px] bg-[#f6f8f5] p-4 text-sm leading-[1.7] text-[#333]">
          {submission.body}
        </p>
        <p className="mt-2 mb-4 text-xs text-[#9aa8a3]">
          AI-assisted indicators are advisory only — the reviewer makes the
          final decision.
        </p>

        <label
          className="mb-1.5 block text-xs font-bold"
          htmlFor="content-reviewer-comment"
        >
          Feedback to contributor
        </label>
        <textarea
          id="content-reviewer-comment"
          value={comment}
          onChange={(event) => {
            setComment(event.target.value);
            setFeedbackError(null);
          }}
          placeholder="Add reviewer notes (optional for approval, required for revision or rejection)"
          className="min-h-[70px] w-full rounded-xl border border-[#dfe7e3] px-[13px] py-3 text-sm outline-none focus-visible:border-[#70a28d]"
        />
        {feedbackError ? (
          <p className="mt-2 text-xs text-[#b3401f]">{feedbackError}</p>
        ) : null}

        <div className="mt-[18px] flex flex-wrap justify-end gap-2.5">
          <button
            type="button"
            disabled={isDeciding}
            className="rounded-full border border-[#ffe6d5] bg-white px-[18px] py-3 font-bold text-[#b3401f] disabled:opacity-60"
            onClick={() => handleDecide('Rejected')}
          >
            Reject
          </button>
          <button
            type="button"
            disabled={isDeciding}
            className="rounded-full border border-[#dfe7e3] bg-white px-[18px] py-3 font-bold text-foreground disabled:opacity-60"
            onClick={() => handleDecide('Revision Requested')}
          >
            Request revision
          </button>
          <button
            type="button"
            disabled={isDeciding}
            className="rounded-full bg-[#12231f] px-[18px] py-3 font-bold text-white hover:bg-[#254b40] disabled:opacity-60"
            onClick={() => handleDecide('Approved')}
          >
            Approve & assign reward
          </button>
        </div>
      </div>
    </div>
  );
}
