import { useEffect, useState } from 'react';

export interface RequestRevisionModalProps {
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
  rewardAmount: string;
  initialFeedback?: string;
}

const DEFAULT_AREAS = [
  'Clarify telemetry data',
  'Add GPS timestamp logs',
  'Update KPI metrics',
  'Budget breakdown',
];

function formatDueDate(days: number): string {
  const target = new Date();
  target.setDate(target.getDate() + days);
  const dd = String(target.getDate()).padStart(2, '0');
  const mm = String(target.getMonth() + 1).padStart(2, '0');
  const yyyy = target.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

export default function RequestRevisionModal({
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
  initialFeedback = '',
}: RequestRevisionModalProps) {
  const [feedback, setFeedback] = useState(initialFeedback);
  const [error, setError] = useState<string | null>(null);
  const [selectedDays, setSelectedDays] = useState<number>(7);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([
    'Clarify telemetry data',
    'Add GPS timestamp logs',
  ]);

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

  const dueDateText = formatDueDate(selectedDays);

  const toggleArea = (area: string) => {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((item) => item !== area) : [...prev, area],
    );
  };

  const handleConfirm = () => {
    const trimmed = feedback.trim();
    if (trimmed.length === 0) {
      setError('Please provide feedback & instructions for the requested revisions.');
      return;
    }
    setError(null);
    onConfirm(trimmed);
  };

  return (
    <div
      className="fixed inset-0 z-[60] overflow-y-auto flex items-center justify-center p-4 sm:p-6 bg-slate-900/50 backdrop-blur-sm transition-all"
      data-purpose="request-revision-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="request-revision-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeciding) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-8">
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0 mt-0.5 shadow-sm">
              <span className="material-symbols-outlined text-[22px]">edit_note</span>
            </div>
            <div className="space-y-1">
              <h3
                id="request-revision-title"
                className="text-lg font-bold text-slate-900 leading-snug tracking-tight"
              >
                Request revision
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                You are requesting changes from{' '}
                <span className="font-semibold text-slate-700">
                  {contributorName}
                </span>{' '}
                for <span className="font-medium text-slate-700">{topicTitle}</span>.
                Please outline the required updates.
              </p>
            </div>
          </div>
          <button
            aria-label="Close modal"
            className="text-slate-400 hover:text-slate-600 w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors shrink-0 cursor-pointer disabled:opacity-40"
            type="button"
            onClick={onClose}
            disabled={isDeciding}
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-6 space-y-5 max-h-[calc(100vh-220px)] overflow-y-auto">
          {/* Contributor & Info Card */}
          <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap pb-2.5 border-b border-slate-200/60">
              <div className="flex items-center gap-2.5">
                {contributorAvatar ? (
                  <img
                    src={contributorAvatar}
                    alt={contributorName}
                    className="w-8 h-8 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {contributorInitials}
                  </div>
                )}
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-tight">
                    {contributorName}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    ID: {formattedContributorId} • {contributorBadge}
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-semibold text-[11px] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 inline-block" />
                Status change: Revision Requested
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="space-y-0.5">
                <span className="text-[11px] text-slate-400 font-medium">Submission</span>
                <p
                  className="font-semibold text-slate-800 leading-tight truncate"
                  title={submissionTitle}
                >
                  {submissionTitle}
                </p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] text-slate-400 font-medium">
                  Current Reward
                </span>
                <p className="font-semibold text-slate-800 leading-tight">
                  {rewardAmount}{' '}
                  <span className="text-[11px] text-slate-500 font-normal">
                    (Held until approved)
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Revision window & deadline */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Revision window &amp; deadline</span>
              <span className="text-[11px] font-medium text-slate-500">
                Due: {dueDateText} ({selectedDays} days)
              </span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                className={`py-1.5 px-3 rounded-lg border text-xs font-medium text-center transition-colors cursor-pointer ${
                  selectedDays === 3
                    ? 'border-amber-200 bg-amber-50/80 font-bold text-amber-700 shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                onClick={() => setSelectedDays(3)}
                disabled={isDeciding}
              >
                3 days
              </button>
              <button
                type="button"
                className={`py-1.5 px-3 rounded-lg border text-xs font-medium text-center transition-colors cursor-pointer ${
                  selectedDays === 7
                    ? 'border-amber-200 bg-amber-50/80 font-bold text-amber-700 shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                onClick={() => setSelectedDays(7)}
                disabled={isDeciding}
              >
                7 days (Standard)
              </button>
              <button
                type="button"
                className={`py-1.5 px-3 rounded-lg border text-xs font-medium text-center transition-colors cursor-pointer ${
                  selectedDays === 14
                    ? 'border-amber-200 bg-amber-50/80 font-bold text-amber-700 shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                onClick={() => setSelectedDays(14)}
                disabled={isDeciding}
              >
                14 days
              </button>
            </div>
          </div>

          {/* Areas requiring update */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">
              Areas requiring update
            </label>
            <div className="flex flex-wrap gap-1.5">
              {DEFAULT_AREAS.map((area) => {
                const isSelected = selectedAreas.includes(area);
                return (
                  <button
                    key={area}
                    type="button"
                    onClick={() => toggleArea(area)}
                    disabled={isDeciding}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                      isSelected
                        ? 'bg-blue-50 border border-blue-200 text-blue-700 font-semibold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <span className="material-symbols-outlined text-[13px]">
                          check
                        </span>
                        {area}
                      </>
                    ) : (
                      <>+ {area}</>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback & instructions */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label
                htmlFor="revision-feedback-input"
                className="font-bold text-slate-700"
              >
                Feedback &amp; instructions to contributor{' '}
                <span className="text-rose-600">*</span>
              </label>
              <span className="text-[11px] text-slate-400 font-normal">
                {feedback.length}/500
              </span>
            </div>
            <textarea
              id="revision-feedback-input"
              className="w-full text-xs text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 resize-y p-3 outline-none leading-relaxed"
              rows={3}
              maxLength={500}
              placeholder="Please outline the required updates..."
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
            <p className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-0.5">
              <span className="material-symbols-outlined text-[14px] text-amber-600">
                info
              </span>
              The contributor will be notified via email and in-app alert to resubmit
              before the deadline.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-colors cursor-pointer disabled:opacity-50"
            type="button"
            onClick={onClose}
            disabled={isDeciding}
          >
            Cancel
          </button>
          <button
            className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white text-xs font-bold shadow-md shadow-amber-600/20 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            type="button"
            onClick={handleConfirm}
            disabled={isDeciding}
          >
            <span className="material-symbols-outlined text-[16px]">send</span>
            <span>{isDeciding ? 'Sending…' : 'Send revision request'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
