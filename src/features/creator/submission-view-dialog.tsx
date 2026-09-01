import { useEffect, type MouseEvent } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { X } from 'lucide-react';

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
      className="fixed inset-0 z-50 grid place-items-center bg-[var(--overlay-scrim)] p-5 backdrop-blur-xs"
      onClick={handleBackdropClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="submission-view-title"
        className="max-h-[88vh] w-full max-w-[560px] overflow-auto rounded-[24px] border border-[var(--dialog-border)] bg-card p-[30px] shadow-2xl"
      >
        <div className="mb-3.5 flex items-start justify-between gap-4">
          <div>
            <p className="text-[12px] font-extrabold tracking-[0.12em] text-brand-sage uppercase">
              {idea.conceptTitle ?? idea.topic ?? '—'}
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
            className="text-[22px] leading-none text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X />
          </button>
        </div>

        <div className="mb-3.5 flex items-center gap-2.5">
          <StatusBadge
            status={idea.status}
            className="px-3 py-1.5 text-xs"
          />
          <span className="text-xs text-muted-foreground">Updated {idea.submitted}</span>
        </div>

        <p className="rounded-[14px] bg-surface-subtle p-4 text-sm leading-[1.7] text-foreground">
          {idea.body}
        </p>

        {feedback.length > 0 ? (
          <div className="mt-3.5 rounded-[14px] border border-border p-4">
            <strong className="mb-1.5 block text-[12px] font-extrabold tracking-[0.08em] text-brand-sage uppercase">
              Reviewer note
            </strong>
            <p className="m-0 text-sm leading-[1.6] text-foreground">{feedback}</p>
          </div>
        ) : null}

        {idea.status === 'Approved' ? (
          <div className="mt-4 flex items-center justify-between rounded-[14px] bg-success-subtle p-4">
            <span className="text-[13px] font-bold text-success">
              Reward credited to your wallet
            </span>
            <strong className="font-heading text-xl text-success">
              {idea.reward}
            </strong>
          </div>
        ) : null}

        {idea.status === 'Published' ? (
          <div className="mt-4 flex items-center justify-between rounded-[14px] bg-success-subtle p-4">
            <span className="text-[13px] font-bold text-success">
              Published & reward paid
            </span>
            <strong className="font-heading text-xl text-success">
              {idea.reward}
            </strong>
          </div>
        ) : null}

        <div className="mt-5 flex justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-auto rounded-full border-border bg-card px-5 py-3 font-bold text-foreground hover:bg-surface-subtle"
          >
            Close
          </Button>
          <Button
            type="button"
            onClick={() => {
              onClose();
              navigate({ to: action.href });
            }}
            className="h-auto rounded-full bg-primary px-5 py-3 font-bold text-primary-foreground hover:bg-brand-forest"
          >
            {action.label}
          </Button>
        </div>
      </div>
    </div>
  );
}
