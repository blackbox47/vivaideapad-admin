import { useEffect, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import StatusBadge from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import type { MyIdea } from '@/models/creator/my-ideas-model';
import { CREATOR_ROUTES } from '@/utils/constants/routes';

interface SubmissionViewDialogProps {
  idea: MyIdea;
  onClose: () => void;
}

function primaryAction(idea: MyIdea): { label: string; href: string } {
  if (idea.status === 'Draft') {
    return { label: 'Continue editing', href: CREATOR_ROUTES.submitIdea };
  }
  if (idea.status === 'Revision Requested') {
    return { label: 'Edit & resubmit', href: CREATOR_ROUTES.submitIdea };
  }
  return { label: 'View in wallet', href: CREATOR_ROUTES.rewards };
}

export default function SubmissionViewDialog({
  idea,
  onClose,
}: SubmissionViewDialogProps) {
  const navigate = useNavigate();
  const action = primaryAction(idea);
  const feedback = idea.feedback?.trim() ?? '';

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[rgba(8,23,18,0.6)] p-5"
      onClick={handleBackdropClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="submission-view-title"
        className="max-h-[88vh] w-full max-w-[560px] overflow-auto rounded-[24px] bg-white p-[30px] shadow-[0_20px_60px_rgba(29,65,54,0.12)]"
      >
        <div className="mb-3.5 flex items-start justify-between gap-4">
          <div>
            <p className="text-[12px] font-extrabold tracking-[0.12em] text-[#527065] uppercase">
              {idea.topic}
            </p>
            <h2
              id="submission-view-title"
              className="mt-1.5 font-heading text-[22px] text-foreground"
            >
              {idea.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[22px] leading-none text-[#687773]"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="mb-3.5 flex items-center gap-2.5">
          <StatusBadge
            status={idea.status}
            className="px-3 py-1.5 text-xs"
          />
          <span className="text-xs text-[#687773]">Updated {idea.submitted}</span>
        </div>

        <p className="rounded-[14px] bg-[#f6f8f5] p-4 text-sm leading-[1.7] text-[#333]">
          {idea.body}
        </p>

        {feedback.length > 0 ? (
          <div className="mt-3.5 rounded-[14px] border border-[#dfe7e3] p-4">
            <strong className="mb-1.5 block text-[12px] font-extrabold tracking-[0.08em] text-[#527065] uppercase">
              Reviewer note
            </strong>
            <p className="m-0 text-sm leading-[1.6] text-[#333]">{feedback}</p>
          </div>
        ) : null}

        {idea.status === 'Approved' ? (
          <div className="mt-4 flex items-center justify-between rounded-[14px] bg-[#dff8eb] p-4">
            <span className="text-[13px] font-bold text-[#16805e]">
              Reward credited to your wallet
            </span>
            <strong className="font-heading text-xl text-[#16805e]">
              {idea.reward}
            </strong>
          </div>
        ) : null}

        {idea.status === 'Published' ? (
          <div className="mt-4 flex items-center justify-between rounded-[14px] bg-[#dff8eb] p-4">
            <span className="text-[13px] font-bold text-[#16805e]">
              Published & reward paid
            </span>
            <strong className="font-heading text-xl text-[#16805e]">
              {idea.reward}
            </strong>
          </div>
        ) : null}

        <div className="mt-5 flex justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-auto rounded-full border-[#dfe7e3] bg-white px-5 py-3 font-bold"
          >
            Close
          </Button>
          <Button
            type="button"
            onClick={() => {
              onClose();
              navigate(action.href);
            }}
            className="h-auto rounded-full bg-[#12231f] px-5 py-3 font-bold text-white hover:bg-[#254b40]"
          >
            {action.label}
          </Button>
        </div>
      </div>
    </div>
  );
}
