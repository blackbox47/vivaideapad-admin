import { useEffect } from 'react';

export interface ApprovalConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeciding?: boolean;
  contributorName: string;
  contributorInitials: string;
  contributorAvatar?: string | null;
  contributorId?: string;
  contributorBadge?: string;
  topicTitle: string;
  submissionTitle: string;
  rewardAmount: string;
  rewardButtonText?: string;
  rewardBudgetNote?: string;
  payoutDestination?: string;
  newStatusText?: string;
}

export default function ApprovalConfirmationModal({
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
  rewardAmount,
  rewardButtonText,
  rewardBudgetNote = '100% of topic challenge budget',
  payoutDestination = 'Direct wallet credit (bKash linked)',
  newStatusText = 'Approved (releases payout)',
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

  const displayButtonText =
    rewardButtonText || rewardAmount.replace(/\.00$/, '');
  const formattedContributorId = contributorId.startsWith('#')
    ? contributorId
    : `#${contributorId}`;

  return (
    <div
      className="fixed inset-0 z-[60] overflow-y-auto flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-all"
      data-purpose="approval-confirmation-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="approval-confirmation-title"
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
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-sm">
            <span className="material-symbols-outlined text-[28px]">verified</span>
          </div>
          <h3
            id="approval-confirmation-title"
            className="text-lg font-bold text-slate-900 tracking-tight"
          >
            Approve submission &amp; assign reward
          </h3>
          <p className="text-xs text-slate-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
            You are about to approve{' '}
            <span className="font-semibold text-slate-700">
              {contributorName}
            </span>
            &apos;s submission for{' '}
            <span className="font-medium text-slate-700">{topicTitle}</span>.
            Please confirm the reward allocation details.
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
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-semibold text-[11px] border border-emerald-200/60">
                Ready for reward
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
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Reward amount</span>
                <div className="text-right">
                  <span className="font-extrabold text-blue-600 text-sm">
                    {rewardAmount}
                  </span>
                  <p className="text-[10px] text-slate-400">
                    {rewardBudgetNote}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Payout destination</span>
                <span className="font-medium text-slate-700 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-slate-400">
                    account_balance_wallet
                  </span>
                  {payoutDestination}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">New status</span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  {newStatusText}
                </span>
              </div>
            </div>
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
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            type="button"
            onClick={onConfirm}
            disabled={isDeciding}
          >
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>
              {isDeciding
                ? 'Approving…'
                : `Confirm approval (${displayButtonText})`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
