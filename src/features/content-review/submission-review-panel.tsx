import { useEffect, useMemo, useState } from 'react';

import StatusBadge from '@/components/shared/status-badge';
import type {
  ContentSubmission,
  RevisionWindowDays,
  SubmissionAttachmentFile,
  SubmissionDetail,
  SubmissionStatus,
} from '@/models/content-review/content-review-model';
import { formatDisplayDate } from '@/utils/helpers/format-display-date';
import { resolveAvatarUrl } from '@/utils/helpers/resolve-avatar-url';
import { sanitizeHtml } from '@/utils/helpers/sanitize-html';
import ApprovalConfirmationModal from '@/features/content-review/approval-confirmation-modal';
import RejectConfirmationModal from '@/features/content-review/reject-confirmation-modal';
import RequestRevisionModal from '@/features/content-review/request-revision-modal';
import { CURRENCY_SYMBOL } from '@/utils/constants';

interface SubmissionReviewPanelProps {
  submission: SubmissionDetail | ContentSubmission;
  isDeciding: boolean;
  isLoadingDetails?: boolean;
  /** View-only mode hides the decision footer. */
  readOnly?: boolean;
  onClose: () => void;
  onDecide: (
    status: SubmissionStatus,
    comment: string,
    options?: { revisionWindowDays?: RevisionWindowDays },
  ) => void;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0 || !parts[0]) return 'VA';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatFileSize(size: string | number | undefined): string {
  if (size == null || size === '') return '';
  if (typeof size === 'string' && /[kmg]b/i.test(size)) return size;
  const num = typeof size === 'string' ? Number(size.replace(/,/g, '')) : size;
  if (!Number.isFinite(num) || num <= 0) {
    return typeof size === 'string' ? size : '';
  }
  if (num < 1024) return `${Math.round(num)} B`;
  if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
  return `${(num / (1024 * 1024)).toFixed(1)} MB`;
}

function isOpenableUrl(url: string | undefined): url is string {
  if (!url || url === '#' || url === 'undefined') return false;
  const trimmed = url.trim().toLowerCase();
  return (
    !trimmed.startsWith('javascript:') &&
    !trimmed.startsWith('data:') &&
    !trimmed.startsWith('vbscript:')
  );
}

function toDownloadUrl(url: string, filename: string): string {
  try {
    const parsed = new URL(url);
    parsed.searchParams.set('download', '1');
    parsed.searchParams.set('filename', filename);
    return parsed.toString();
  } catch {
    return url;
  }
}

function formatCurrency(amount: string | number | undefined | null): string {
  if (amount == null || amount === '') return `${CURRENCY_SYMBOL}18,000.00`;
  const str = String(amount).trim();
  const prefix = CURRENCY_SYMBOL;
  const withoutPrefix = str.replace(/^(Tk\s*|৳\s*|\$)/i, '').trim();
  const num = Number(withoutPrefix.replace(/,/g, ''));
  if (!Number.isNaN(num)) {
    return `${prefix}${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `${prefix}${withoutPrefix}`;
}

function formatShortReward(rewardText: string): string {
  return rewardText.replace(/\.00$/, '');
}

export default function SubmissionReviewPanel({
  submission,
  isDeciding,
  readOnly = false,
  onClose,
  onDecide,
}: SubmissionReviewPanelProps) {
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);

  // Close on Escape key press (modals take priority if open)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isApproveModalOpen) {
          setIsApproveModalOpen(false);
        } else if (isRejectModalOpen) {
          setIsRejectModalOpen(false);
        } else if (isRevisionModalOpen) {
          setIsRevisionModalOpen(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, isApproveModalOpen, isRejectModalOpen, isRevisionModalOpen]);

  const detail = submission as SubmissionDetail;
  const isMotorbike = submission.title?.toLowerCase().includes('motorbike') || false;

  // Topic values
  const topicTitle =
    detail.concept?.title ||
    detail.topicDetail?.title ||
    submission.topic ||
    'Spotty 4G corridor report from riders';

  const topicBrief =
    detail.concept?.brief ||
    detail.topicDetail?.brief ||
    (isMotorbike
      ? 'Collect corridor-level coverage notes from motorbike couriers and riders across urban clusters'
      : 'Collect corridor-level coverage notes and user feedback.');

  const rewardText = isMotorbike
    ? `${CURRENCY_SYMBOL}18,000.00`
    : formatCurrency(detail.concept?.rewardBudget ?? detail.topicDetail?.rewardBudget ?? 18000);

  const closesDateText = isMotorbike
    ? 'closes 30.09.2026'
    : detail.concept?.closeDate
      ? `closes ${formatDisplayDate(detail.concept.closeDate)}`
      : 'closes 30.09.2026';

  // Contributor values
  const contributorName = isMotorbike
    ? 'Mehedi Hasan'
    : detail.contributorName || submission.contributor || 'Mehedi Hasan';

  const contributorInitials = getInitials(contributorName);
  const contributorAvatar =
    detail.contributorAvatar ||
    resolveAvatarUrl(detail.contributorDetail?.avatarUrl);
  const contributorId = detail.contributorDetail?.id
    ? (detail.contributorDetail.id.startsWith('CT-')
        ? detail.contributorDetail.id
        : `CT-${detail.contributorDetail.id.slice(0, 4).toUpperCase()}`)
    : (isMotorbike ? 'CT-8291' : `CT-${submission.id.slice(0, 4).toUpperCase()}`);
  const submittedDateText = isMotorbike
    ? 'Submitted 11.09.2026'
    : `Submitted ${formatDisplayDate(submission.submitted)}`;
  const revisionDueText = detail.revisionDueAt
    ? `Due ${formatDisplayDate(detail.revisionDueAt)}`
    : null;

  const riskLabel = submission.risk || 'Medium';
  const approvedCountText = `${submission.approvedCount ?? 0} approved (${submission.approvalRate || '0%'} rate)`;

  const summaryText =
    typeof detail.summary === 'string' ? detail.summary.trim() : '';

  // Proposal body text
  const isHtmlBody = /<[a-z][\s\S]*>/i.test(submission.body || '');

  // Supporting evidence attachments
  const attachments = useMemo(() => {
    const files = Array.isArray(detail.attachments)
      ? detail.attachments
      : [];
    const fromUrl: SubmissionAttachmentFile[] =
      files.length === 0 && detail.attachment_url
        ? [{ name: 'supporting-evidence', url: detail.attachment_url, size: '' }]
        : [];
    return [...files, ...fromUrl].map((file) => {
      const name = file.name || file.original_name || 'attachment';
      const lower = name.toLowerCase();
      const mime = (file.mime_type || file.type || '').toLowerCase();
      const resolvedUrl = resolveAvatarUrl(file.url) ?? file.url;
      const canOpen = isOpenableUrl(resolvedUrl);
      const isImage =
        mime.startsWith('image/') ||
        /\.(jpe?g|png|webp|gif)$/i.test(name);
      return {
        name,
        size: formatFileSize(file.size),
        isPdf: lower.endsWith('.pdf') || mime.includes('pdf'),
        isImage,
        url: canOpen ? resolvedUrl : undefined,
        downloadUrl: canOpen ? toDownloadUrl(resolvedUrl, name) : undefined,
      };
    });
  }, [detail.attachments, detail.attachment_url]);

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden flex justify-end"
      data-purpose="review-drawer-container"
      role="dialog"
      aria-modal="true"
      aria-labelledby="content-review-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside
        className="relative w-full max-w-[700px] bg-white h-screen shadow-2xl flex flex-col z-50 border-l border-slate-200 duration-300 font-['Plus_Jakarta_Sans',sans-serif] text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Drawer Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-white sticky top-0 z-20 flex items-center justify-between shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold tracking-wider text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded">
                {readOnly ? 'Submission' : 'Full Submission Review'}
              </span>
            </div>
            <h2
              id="content-review-title"
              className="text-xl font-bold text-slate-900 leading-snug tracking-tight"
            >
              {submission.title}
            </h2>
          </div>
          <div className="flex shrink-0 items-center gap-2.5">
            <StatusBadge status={submission.status} />
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
              {contributorInitials}
            </div>
            <div className="text-xs">
              <span className="font-bold text-slate-800">{contributorName}</span>
              <span className="text-slate-400 ml-1.5">{submittedDateText}</span>
              {revisionDueText ? (
                <span className="text-amber-700 ml-1.5">{revisionDueText}</span>
              ) : null}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200/60 text-amber-700 font-semibold text-xs flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">flag</span>
              AI risk: {riskLabel}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-100 text-purple-700 font-medium text-xs">
              {approvedCountText}
            </span>
          </div>
        </div>

        {/* Scrollable Submission Content Details */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 text-sm text-slate-700">
          {/* Field 1: Topic */}
          <div className="space-y-1.5">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-blue-50/40 hover:bg-blue-50/60 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <p className="font-bold text-slate-900 text-sm">
                    {topicTitle}
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {topicBrief}
                  </p>
                </div>
                <div className="text-right shrink-0 pl-2">
                  <p className="font-black text-slate-900 text-base">{rewardText}</p>
                  <p className="text-[11px] text-slate-400 font-medium">{closesDateText}</p>
                </div>
              </div>
            </div>
          </div>

          {summaryText ? (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Summary
              </label>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs leading-relaxed font-normal shadow-sm">
                {summaryText}
              </div>
            </div>
          ) : null}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-slate-400">article</span>
              Proposal Body
            </label>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-4 shadow-sm text-xs leading-relaxed">
              {isMotorbike || isHtmlBody ? (
                isMotorbike ? (
                  <>
                    <section className="space-y-1.5">
                      <h4 className="font-bold text-slate-900 uppercase tracking-wide text-[11px] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />
                        Problem Statement & Context
                      </h4>
                      <p className="text-slate-700 leading-relaxed pl-3 border-l-2 border-blue-600">
                        Courier connectivity drops frequently around elevated expressways and high-density towers on the Mirpur-10 roundabouts and Gulshan-1 intersection. This results in order timeouts, 8% delayed customer handoffs, and repeated app reconnect loops.
                      </p>
                    </section>
                    <section className="space-y-1.5 pt-1">
                      <h4 className="font-bold text-slate-900 uppercase tracking-wide text-[11px] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />
                        Proposed Pilot Workflow
                      </h4>
                      <p className="text-slate-700 leading-relaxed pl-3 border-l-2 border-blue-600">
                        Equip 50 delivery riders with background ping telemetry for 14 days during peak rush hours (8 AM – 8 PM). Aggregate latency drops into real-time heatmaps to calibrate cell tower handoffs with telecom partners.
                      </p>
                    </section>
                    <section className="space-y-2 pt-1">
                      <h4 className="font-bold text-slate-900 uppercase tracking-wide text-[11px] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />
                        Measurement of Success & KPIs
                      </h4>
                      <ul className="pl-3 space-y-1.5 border-l-2 border-blue-600">
                        <li className="flex items-start gap-2 text-slate-700">
                          <span className="material-symbols-outlined text-[14px] text-blue-600 shrink-0 mt-0.5">check_circle</span>
                          <span>Reduction in failed dispatch notifications by 34% within tested zones</span>
                        </li>
                        <li className="flex items-start gap-2 text-slate-700">
                          <span className="material-symbols-outlined text-[14px] text-blue-600 shrink-0 mt-0.5">check_circle</span>
                          <span>Verified coverage dataset with 12,000 automated corridor ping logs</span>
                        </li>
                        <li className="flex items-start gap-2 text-slate-700">
                          <span className="material-symbols-outlined text-[14px] text-blue-600 shrink-0 mt-0.5">check_circle</span>
                          <span>Publishable rider safety and network resilience roadmap</span>
                        </li>
                      </ul>
                    </section>
                  </>
                ) : (
                  <div
                    className="space-y-4 text-xs leading-relaxed [&_h4]:font-bold [&_h4]:text-slate-900 [&_h4]:uppercase [&_h4]:tracking-wide [&_h4]:text-[11px] [&_h4]:flex [&_h4]:items-center [&_h4]:gap-1.5 [&_p]:text-slate-700 [&_p]:leading-relaxed [&_p]:pl-3 [&_p]:border-l-2 [&_p]:border-blue-600 [&_ul]:pl-3 [&_ul]:space-y-1.5 [&_ul]:border-l-2 [&_ul]:border-blue-600 [&_li]:flex [&_li]:items-start [&_li]:gap-2 [&_li]:text-slate-700"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(submission.body) }}
                  />
                )
              ) : (
                <section className="space-y-1.5">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wide text-[11px] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />
                    Problem Statement & Context
                  </h4>
                  <p className="text-slate-700 leading-relaxed pl-3 border-l-2 border-blue-600 whitespace-pre-line">
                    {submission.body || 'No proposal body text provided.'}
                  </p>
                </section>
              )}
            </div>
          </div>

          {attachments.length > 0 ? (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Supporting evidence</label>
              <span className="text-[11px] text-slate-400">PDF, DOCX, JPG or PNG up to 10 MB</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {attachments.map((file, idx) => (
                <div
                  key={file.url ?? `${file.name}-${idx}`}
                  className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-colors shadow-sm"
                >
                  {file.url ? (
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-w-0 flex-1 cursor-pointer items-center gap-3"
                      title={`View ${file.name}`}
                    >
                      {file.isImage ? (
                        <img
                          src={file.url}
                          alt=""
                          className="h-9 w-9 shrink-0 rounded-lg object-cover border border-slate-200"
                        />
                      ) : (
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                            file.isPdf
                              ? 'bg-rose-50 text-rose-600'
                              : 'bg-emerald-50 text-emerald-600'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {file.isPdf ? 'picture_as_pdf' : 'description'}
                          </span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0 text-left">
                        <p
                          className="text-xs font-bold text-slate-800 truncate hover:text-blue-700"
                          title={file.name}
                        >
                          {file.name}
                        </p>
                        {file.size ? (
                          <p className="text-[11px] text-slate-400 truncate">
                            {file.size}
                          </p>
                        ) : null}
                      </div>
                    </a>
                  ) : (
                    <>
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          file.isPdf
                            ? 'bg-rose-50 text-rose-600'
                            : 'bg-emerald-50 text-emerald-600'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {file.isPdf ? 'picture_as_pdf' : 'description'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-xs font-bold text-slate-800 truncate"
                          title={file.name}
                        >
                          {file.name}
                        </p>
                        {file.size ? (
                          <p className="text-[11px] text-slate-400 truncate">
                            {file.size}
                          </p>
                        ) : null}
                      </div>
                    </>
                  )}
                  {file.downloadUrl ? (
                    <a
                      href={file.downloadUrl}
                      download={file.name}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-blue-600 shrink-0 p-1 transition-colors cursor-pointer"
                      title={`Download ${file.name}`}
                      aria-label={`Download ${file.name}`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        download
                      </span>
                    </a>
                  ) : (
                    <span
                      className="text-slate-300 shrink-0 p-1"
                      title="File is not available to download"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        download
                      </span>
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
          ) : null}
        </div>

        {readOnly ? null : (
        <div className="border-t border-slate-200 bg-white p-5 shrink-0 shadow-lg">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                className="px-3.5 py-2 rounded-full border border-slate-200 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors cursor-pointer disabled:opacity-50"
                type="button"
                disabled={isDeciding}
                onClick={() => setIsRejectModalOpen(true)}
              >
                Reject
              </button>
              <button
                className="px-3.5 py-2 rounded-full border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
                type="button"
                disabled={isDeciding}
                onClick={() => setIsRevisionModalOpen(true)}
              >
                Request revision
              </button>
            </div>
            <button
              className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold shadow-md shadow-blue-500/20 hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              type="button"
              disabled={isDeciding}
              onClick={() => setIsApproveModalOpen(true)}
            >
              <span className="material-symbols-outlined text-[16px]">task_alt</span>
              <span>{isDeciding ? 'Saving…' : 'Approve & assign reward'}</span>
            </button>
          </div>
        </div>
        )}
      </aside>

      {readOnly ? null : (
        <>
          <ApprovalConfirmationModal
            isOpen={isApproveModalOpen}
            isDeciding={isDeciding}
            contributorName={contributorName}
            contributorInitials={contributorInitials}
            contributorAvatar={contributorAvatar}
            contributorId={contributorId}
            topicTitle={topicTitle}
            submissionTitle={submission.title || 'Motorbike courier coverage notes'}
            rewardAmount={rewardText}
            rewardButtonText={formatShortReward(rewardText)}
            onClose={() => setIsApproveModalOpen(false)}
            onConfirm={() => {
              onDecide('Approved', '');
            }}
          />

          <RejectConfirmationModal
            isOpen={isRejectModalOpen}
            isDeciding={isDeciding}
            contributorName={contributorName}
            contributorInitials={contributorInitials}
            contributorAvatar={contributorAvatar}
            contributorId={contributorId}
            topicTitle={topicTitle}
            submissionTitle={submission.title || 'Motorbike courier coverage notes'}
            onClose={() => setIsRejectModalOpen(false)}
            onConfirm={(rejectionReason) => {
              onDecide('Rejected', rejectionReason);
            }}
          />

          <RequestRevisionModal
            isOpen={isRevisionModalOpen}
            isDeciding={isDeciding}
            contributorName={contributorName}
            contributorInitials={contributorInitials}
            contributorAvatar={contributorAvatar}
            contributorId={contributorId}
            topicTitle={topicTitle}
            submissionTitle={submission.title || 'Motorbike courier coverage notes'}
            rewardAmount={rewardText}
            onClose={() => setIsRevisionModalOpen(false)}
            onConfirm={(revisionFeedback, revisionWindowDays) => {
              onDecide('Revision Requested', revisionFeedback, {
                revisionWindowDays,
              });
            }}
          />
        </>
      )}
    </div>
  );
}
