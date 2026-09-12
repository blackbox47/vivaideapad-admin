import { useEffect, useState } from 'react';

import StatusBadge from '@/components/shared/status-badge';
import type { Applicant, ApplicantStatus } from '@/models/people/people-model';
import { formatDisplayDate } from '@/utils/helpers/format-display-date';
import { sanitizeHtml } from '@/utils/helpers/sanitize-html';

interface ApplicantReviewPanelProps {
  applicant: Applicant;
  isDeciding: boolean;
  readOnly?: boolean;
  onClose: () => void;
  onDecide: (status: ApplicantStatus, comment: string) => void;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0 || !parts[0]) return 'AP';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function ApplicantReviewPanel({
  applicant,
  isDeciding,
  readOnly = false,
  onClose,
  onDecide,
}: ApplicantReviewPanelProps) {
  const [comment, setComment] = useState('');
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Lock body scroll while drawer is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleDecide = (status: ApplicantStatus) => {
    const trimmed = comment.trim();
    const needsComment = status === 'Rejected';

    if (needsComment && trimmed.length === 0) {
      setFeedbackError('Add reviewer notes before rejecting.');
      return;
    }

    setFeedbackError(null);
    onDecide(status, trimmed);
  };

  const isHtmlBody = /<[a-z][\s\S]*>/i.test(applicant.body || '');
  const initials = getInitials(applicant.name);

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden flex justify-end"
      data-purpose="applicant-review-drawer-container"
      role="dialog"
      aria-modal="true"
      aria-labelledby="applicant-review-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 cursor-pointer"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <aside
        className="relative w-full max-w-[640px] md:max-w-[700px] bg-white h-screen shadow-2xl flex flex-col z-50 border-l border-slate-200 duration-300 font-['Plus_Jakarta_Sans',sans-serif] text-slate-800 animate-in slide-in-from-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Drawer Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-white sticky top-0 z-20 flex items-center justify-between shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold tracking-wider text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded">
                {readOnly ? 'Applicant' : 'Applicant Review'}
              </span>
            </div>
            <h2
              id="applicant-review-title"
              className="text-xl font-bold text-slate-900 leading-snug tracking-tight"
            >
              {applicant.title}
            </h2>
          </div>
          <div className="flex shrink-0 items-center gap-2.5">
            <StatusBadge status={applicant.status} />
            <button
              aria-label="Close drawer"
              className="text-slate-400 hover:text-slate-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
              type="button"
              onClick={onClose}
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Sub-header metadata pill bar */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 select-none">
              {initials}
            </div>
            <div className="text-xs">
              <span className="font-bold text-slate-800">{applicant.name}</span>
              <span className="text-slate-400 ml-1.5">{applicant.email}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200/60 text-slate-600 font-medium text-xs flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">calendar_today</span>
              Submitted {formatDisplayDate(applicant.submitted)}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-medium text-xs flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">folder</span>
              {applicant.topic}
            </span>
          </div>
        </div>

        {/* Scrollable Content Details */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 text-sm text-slate-700">
          {/* Field 1: Application Details Card */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-blue-600">badge</span>
                Application Details
              </span>
              <span className="text-[11px] text-slate-400 font-mono">ID: {applicant.id}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs pt-1 border-t border-slate-200/60">
              <div>
                <span className="text-[11px] text-slate-400 block mb-0.5">Applicant</span>
                <strong className="text-slate-900 font-semibold">{applicant.name}</strong>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block mb-0.5">Email</span>
                <a
                  href={`mailto:${applicant.email}`}
                  className="text-blue-600 hover:underline font-medium break-all"
                >
                  {applicant.email}
                </a>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block mb-0.5">Applied For</span>
                <span className="text-slate-800 font-medium">{applicant.topic}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block mb-0.5">Source</span>
                <span className="text-slate-800 font-medium">Website signup</span>
              </div>
            </div>
          </div>

          {/* Field 2: Submitted Concept / Proposal */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-slate-400">article</span>
              Submitted Concept
            </label>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-3 shadow-sm text-xs leading-relaxed">
              <section className="space-y-1.5">
                <h4 className="font-bold text-slate-900 uppercase tracking-wide text-[11px] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />
                  Concept Pitch & Proposal Details
                </h4>
                {isHtmlBody ? (
                  <div
                    className="text-slate-700 leading-relaxed pl-3 border-l-2 border-blue-600 [&_p]:mb-2 [&_p:last-child]:mb-0"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(applicant.body) }}
                  />
                ) : (
                  <p className="text-slate-700 leading-relaxed pl-3 border-l-2 border-blue-600 whitespace-pre-line">
                    {applicant.body || 'No concept description provided.'}
                  </p>
                )}
              </section>
            </div>
          </div>

          {/* Field 3: Guidelines check */}
          <div className="flex items-center gap-2.5 p-3 rounded-xl border border-emerald-200/80 bg-emerald-50/60 text-xs text-emerald-800">
            <span className="material-symbols-outlined text-[18px] text-emerald-600 shrink-0">check_circle</span>
            <span className="font-medium">Applicant confirmed originality and accepted content guidelines.</span>
          </div>

          {/* Field 4: Info callout */}
          {!readOnly && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl border border-blue-100 bg-blue-50/50 text-xs text-blue-800">
              <span className="material-symbols-outlined text-[18px] text-blue-600 shrink-0 mt-0.5">info</span>
              <p className="leading-relaxed">
                Approving grants this applicant contributor portal access. They will appear under <strong>Invited</strong> until they become an active contributor.
              </p>
            </div>
          )}
        </div>

        {/* Sticky Decision Footer */}
        {readOnly ? null : (
          <div className="border-t border-slate-200 bg-white p-5 space-y-3 shrink-0 shadow-lg">
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-slate-800">
                Reviewer Feedback to applicant
              </div>
              <textarea
                className="w-full text-xs text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-y p-2.5 outline-none"
                placeholder="Share reviewer remarks, onboarding notes, or reason for rejection..."
                rows={2}
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                  setFeedbackError(null);
                }}
              />
              {feedbackError && (
                <p className="text-xs text-rose-600 font-medium">{feedbackError}</p>
              )}
            </div>
            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                className="px-4 py-2 rounded-full border border-slate-200 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors cursor-pointer disabled:opacity-50"
                type="button"
                disabled={isDeciding}
                onClick={() => handleDecide('Rejected')}
              >
                Reject
              </button>
              <button
                className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold shadow-md shadow-blue-500/20 hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                type="button"
                disabled={isDeciding}
                onClick={() => handleDecide('Approved')}
              >
                <span className="material-symbols-outlined text-[16px]">task_alt</span>
                <span>{isDeciding ? 'Saving…' : 'Approve applicant'}</span>
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
