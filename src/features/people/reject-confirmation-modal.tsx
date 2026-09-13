import { useEffect, useState } from 'react';

export interface RejectConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (feedback: string) => void;
  isDeciding?: boolean;
  applicantName: string;
  applicantInitials: string;
  applicantEmail?: string;
  topicTitle: string;
  applicationTitle: string;
  initialFeedback?: string;
  impactText?: string;
}

const REJECTION_PRESETS = [
  'Does not meet quality guidelines',
  'Insufficient details provided',
  'Topic already well-covered',
  'Not aligned with current focus',
];

export default function RejectConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  isDeciding = false,
  applicantName,
  applicantInitials,
  applicantEmail,
  topicTitle,
  applicationTitle,
  initialFeedback = '',
  impactText = 'Application archived (no contributor access granted)',
}: RejectConfirmationModalProps) {
  const [feedback, setFeedback] = useState(initialFeedback);

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

  const handleConfirm = () => {
    onConfirm(feedback.trim());
  };

  return (
    <div
      className="fixed inset-0 z-[60] overflow-y-auto flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-all"
      data-purpose="reject-applicant-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reject-applicant-title"
    >
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden font-['Plus_Jakarta_Sans',sans-serif] text-slate-800 animate-in fade-in zoom-in-95 duration-200">
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
            <span className="material-symbols-outlined text-[28px]">person_cancel</span>
          </div>
          <h3
            id="reject-applicant-title"
            className="text-lg font-bold text-slate-900 tracking-tight"
          >
            Reject applicant
          </h3>
          <p className="text-xs text-slate-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
            You are about to reject{' '}
            <span className="font-semibold text-slate-700">
              {applicantName}
            </span>
            &apos;s application for{' '}
            <span className="font-medium text-slate-700">{topicTitle}</span>.
          </p>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4">
          <div className="bg-slate-50 rounded-xl border border-slate-200/60 p-4 space-y-3">
            {/* Applicant Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 select-none">
                  {applicantInitials}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">
                    {applicantName}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {applicantEmail}
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 font-semibold text-[11px] border border-rose-200 shrink-0 ml-2">
                Status change: Rejected
              </span>
            </div>

            {/* Details List */}
            <div className="border-t border-slate-200/60 pt-3 space-y-2 text-xs">
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-500 shrink-0">Application</span>
                <span
                  className="font-semibold text-slate-800 text-right truncate max-w-[240px]"
                  title={applicationTitle}
                >
                  {applicationTitle}
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
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <label htmlFor="applicant-rejection-feedback-input">
                Reason for rejection{' '}
                <span className="font-medium text-slate-400">(optional)</span>
              </label>
              <span className="font-normal text-slate-400 text-[11px]">
                {feedback.length}/500
              </span>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-1.5">
              {REJECTION_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  disabled={isDeciding}
                  onClick={() => {
                    setFeedback(preset);
                  }}
                  className="px-2 py-0.5 text-[11px] font-medium rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {preset}
                </button>
              ))}
            </div>

            <textarea
              id="applicant-rejection-feedback-input"
              className="w-full text-xs text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 resize-y p-2.5 outline-none transition-all"
              placeholder="Explain clearly why this application is rejected..."
              rows={3}
              maxLength={500}
              value={feedback}
              onChange={(e) => {
                setFeedback(e.target.value);
              }}
              disabled={isDeciding}
            />
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
            <span className="material-symbols-outlined text-[16px]">cancel</span>
            <span>{isDeciding ? 'Rejecting…' : 'Confirm rejection'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
