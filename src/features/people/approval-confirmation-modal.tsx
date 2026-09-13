import { useEffect } from 'react';

export interface ApprovalConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeciding?: boolean;
  applicantName: string;
  applicantInitials: string;
  applicantEmail?: string;
  topicTitle: string;
  applicationTitle: string;
  impactText?: string;
}

export default function ApprovalConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  isDeciding = false,
  applicantName,
  applicantInitials,
  applicantEmail,
  topicTitle,
  applicationTitle,
  impactText = 'Promoted to contributor • Listed under Invited',
}: ApprovalConfirmationModalProps) {
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

  return (
    <div
      className="fixed inset-0 z-[60] overflow-y-auto flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-all"
      data-purpose="approval-confirmation-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="approval-applicant-title"
    >
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden font-['Plus_Jakarta_Sans',sans-serif] text-slate-800 animate-in fade-in zoom-in-95 duration-200">
        <button
          aria-label="Close modal"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-40"
          type="button"
          onClick={onClose}
          disabled={isDeciding}
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="p-6 text-center border-b border-slate-100">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center mx-auto mb-3 shadow-sm">
            <span className="material-symbols-outlined text-[28px]">verified</span>
          </div>
          <h3
            id="approval-applicant-title"
            className="text-lg font-bold text-slate-900 tracking-tight"
          >
            Approve applicant &amp; grant access
          </h3>
          <p className="text-xs text-slate-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
            You are about to approve{' '}
            <span className="font-semibold text-slate-700">
              {applicantName}
            </span>
            &apos;s application for{' '}
            <span className="font-medium text-slate-700">{topicTitle}</span>.
            They will receive contributor portal access.
          </p>
        </div>

        <div className="p-6">
          <div className="bg-slate-50 rounded-xl border border-slate-200/60 p-4 space-y-3">
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
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-semibold text-[11px] border border-emerald-200 shrink-0 ml-2">
                Status change: Approved
              </span>
            </div>

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
                <span className="text-slate-500">Access role</span>
                <span className="font-semibold text-blue-600 text-right flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">badge</span>
                  Contributor Portal Access
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Impact</span>
                <span className="font-semibold text-emerald-600 text-right">
                  {impactText}
                </span>
              </div>
            </div>
          </div>
        </div>

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
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            type="button"
            onClick={onConfirm}
            disabled={isDeciding}
          >
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>{isDeciding ? 'Approving…' : 'Confirm approval'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
