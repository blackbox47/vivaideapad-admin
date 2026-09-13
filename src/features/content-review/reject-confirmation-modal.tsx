import { useEffect, useState } from 'react';
import { CURRENCY_SYMBOL } from '@/utils/constants';

export interface RejectConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (feedback: string) => void;
  isDeciding?: boolean;
  contributorName: string;
  contributorInitials: string;
  contributorAvatar?: string | null;
  contributorId?: string;
  contributorBadge?: string;
  topicTitle: string;
  submissionTitle: string;
  initialFeedback?: string;
  impactText?: string;
}

export default function RejectConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  isDeciding = false,
  contributorName,
  contributorInitials,
  contributorAvatar,
  contributorId = 'CT-8291',
  contributorBadge = 'Verified Contributor',
  topicTitle,
  submissionTitle,
  initialFeedback = '',
  impactText = `${CURRENCY_SYMBOL}0.00 released (no reward)`,
}: RejectConfirmationModalProps) {
  const [feedback, setFeedback] = useState(initialFeedback);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isOpen && event.key === 'Escape' && !isDeciding) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isDeciding, onClose]);

  if (!isOpen) return null;

  const formattedContributorId = contributorId.startsWith('#')
    ? contributorId
    : `#${contributorId}`;

  const handleConfirm = () => {
    const trimmed = feedback.trim();
    if (trimmed.length === 0) {
      setError('Please provide feedback explaining why this submission is rejected.');
      return;
    }
    setError(null);
    onConfirm(trimmed);
  };

  return (
    <div
      className="fixed inset-0 z-[60] overflow-y-auto flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-all"
      data-purpose="rejection-confirmation-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reject-confirmation-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeciding) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Close button */}
        <button
          aria-label="Close modal"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-40"
          type="button"
          onClick={onClose}
          disabled={isDeciding}
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Modal Header */}
        <div className="p-6 text-center border-b border-slate-100">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 border border-rose-200/60 flex items-center justify-center mx-auto mb-3 shadow-sm">
            <span className="material-symbols-outlined text-[28px]">cancel</span>
          </div>
          <h3
            id="reject-confirmation-title"
            className="text-lg font-bold text-slate-900 tracking-tight"
          >
            Reject submission
          </h3>
          <p className="text-xs text-slate-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
            You are about to reject{' '}
            <span className="font-semibold text-slate-700">
              {contributorName}
            </span>
            &apos;s submission for{' '}
            <span className="font-medium text-slate-700">{topicTitle}</span>.
            Please provide a clear reason to notify the contributor.
          </p>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4">
          <div className="bg-slate-50 rounded-xl border border-slate-200/60 p-4 space-y-3">
            {/* Contributor Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {contributorAvatar ? (
                  <img
                    src={contributorAvatar}
                    alt={contributorName}
                    className="w-7 h-7 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {contributorInitials}
                  </div>
                )}
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    {contributorName}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    ID: {formattedContributorId} • {contributorBadge}
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 font-semibold text-[11px] border border-rose-200">
                Status change: Rejected
              </span>
            </div>

            {/* Details List */}
            <div className="border-t border-slate-200/60 pt-3 space-y-2 text-xs">
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-500 shrink-0">Submission</span>
                <span
                  className="font-semibold text-slate-800 text-right truncate max-w-[240px]"
                  title={submissionTitle}
                >
                  {submissionTitle}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-500 shrink-0">Topic</span>
                <span
                  className="font-medium text-slate-700 text-right truncate max-w-[240px]"
                  title={topicTitle}
                >
                  {topicTitle}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Impact</span>
                <span className="font-semibold text-rose-600 text-right">
                  {impactText}
                </span>
              </div>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <label htmlFor="rejection-feedback-input">
                Feedback to contributor <span className="text-rose-600">*</span>
              </label>
              <span className="font-normal text-slate-400 text-[11px]">
                {feedback.length}/500
              </span>
            </div>
            <textarea
              id="rejection-feedback-input"
              className="w-full text-xs text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 resize-y p-2.5 outline-none"
              placeholder="Explain clearly why this submission was rejected and what could be improved next time..."
              rows={3}
              maxLength={500}
              value={feedback}
              onChange={(e) => {
                setFeedback(e.target.value);
                setError(null);
              }}
              disabled={isDeciding}
            />
            {error && (
              <p className="text-xs text-rose-600 font-medium">{error}</p>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200/60 flex items-center justify-end gap-3">
          <button
            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200/60 font-medium text-xs transition-colors cursor-pointer disabled:opacity-50"
            type="button"
            onClick={onClose}
            disabled={isDeciding}
          >
            Cancel
          </button>
          <button
            className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold text-xs shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            type="button"
            onClick={handleConfirm}
            disabled={isDeciding}
          >
            <span className="material-symbols-outlined text-[16px]">block</span>
            <span>{isDeciding ? 'Rejecting…' : 'Confirm rejection'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
