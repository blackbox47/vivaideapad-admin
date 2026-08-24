import { useState } from 'react';

import StatusBadge from '@/components/shared/status-badge';
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
    <div className="fixed inset-0 z-50 grid place-items-center bg-[rgba(8,23,18,0.6)] p-5">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="applicant-review-title"
        className="max-h-[90vh] w-full max-w-[560px] overflow-auto rounded-[24px] bg-white p-7 shadow-[0_20px_60px_rgba(29,65,54,0.12)]"
      >
        <div className="mb-3.5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold tracking-[0.12em] text-[#527065] uppercase">
              Applicant review
            </p>
            <h2
              id="applicant-review-title"
              className="mt-1.5 font-heading text-[22px] tracking-[-0.04em] text-foreground"
            >
              {applicant.title}
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

        <div className="mb-3.5 grid grid-cols-2 gap-2.5 rounded-[14px] bg-[#f6f8f5] p-4 text-[13px]">
          <div>
            <span className="mb-0.5 block text-[11px] text-[#687773]">
              Applicant
            </span>
            <strong>{applicant.name}</strong>
          </div>
          <div>
            <span className="mb-0.5 block text-[11px] text-[#687773]">Email</span>
            <strong>{applicant.email}</strong>
          </div>
          <div>
            <span className="mb-0.5 block text-[11px] text-[#687773]">
              Applied for
            </span>
            <strong>{applicant.topic}</strong>
          </div>
          <div>
            <span className="mb-0.5 block text-[11px] text-[#687773]">
              Submitted
            </span>
            <strong>{applicant.submitted}</strong>
          </div>
          <div>
            <span className="mb-0.5 block text-[11px] text-[#687773]">Source</span>
            <strong>Website signup</strong>
          </div>
          <div>
            <span className="mb-0.5 block text-[11px] text-[#687773]">Status</span>
            <StatusBadge status={applicant.status} />
          </div>
        </div>

        <span className="mb-1.5 block text-xs font-bold">Submitted concept</span>
        <p className="rounded-[14px] bg-[#f6f8f5] p-4 text-sm leading-[1.7] text-[#333]">
          {applicant.body}
        </p>

        <label className="my-3.5 flex items-start gap-2 text-xs">
          <input type="checkbox" defaultChecked disabled />
          Applicant confirmed originality and accepted content guidelines.
        </label>

        <label className="mb-1.5 block text-xs font-bold" htmlFor="reviewer-comment">
          Reviewer comment
        </label>
        <textarea
          id="reviewer-comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Required if requesting revision or rejecting"
          className="min-h-[60px] w-full rounded-xl border border-[#dfe7e3] px-[13px] py-3 text-sm outline-none focus-visible:border-[#70a28d]"
        />
        <p className="mt-2.5 text-xs text-[#687773]">
          Approving grants this applicant contributor portal access. They will
          appear under Invited until they sign in and submit against a live task.
        </p>

        <div className="mt-[18px] flex flex-wrap justify-end gap-2.5">
          <button
            type="button"
            disabled={isDeciding}
            className="rounded-full border border-[#ffe6d5] bg-white px-[18px] py-3 font-bold text-[#b3401f] disabled:opacity-60"
            onClick={() => onDecide('Rejected', comment)}
          >
            Reject
          </button>
          <button
            type="button"
            disabled={isDeciding}
            className="rounded-full border border-[#dfe7e3] bg-white px-[18px] py-3 font-bold text-foreground disabled:opacity-60"
            onClick={() => onDecide('Revision Requested', comment)}
          >
            Request revision
          </button>
          <button
            type="button"
            disabled={isDeciding}
            className="rounded-full bg-[#12231f] px-[18px] py-3 font-bold text-white hover:bg-[#254b40] disabled:opacity-60"
            onClick={() => onDecide('Approved', comment)}
          >
            Approve applicant
          </button>
        </div>
      </div>
    </div>
  );
}
