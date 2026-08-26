import { useState } from 'react';

import type { Payout } from '@/models/payouts/payouts-model';

interface PayoutProcessPanelProps {
  payout: Payout;
  isDeciding: boolean;
  onClose: () => void;
  onDecide: (status: 'Paid' | 'Rejected', note: string) => void;
}

export default function PayoutProcessPanel({
  payout,
  isDeciding,
  onClose,
  onDecide,
}: PayoutProcessPanelProps) {
  const [note, setNote] = useState('');
  const [noteError, setNoteError] = useState<string | null>(null);

  const handleDecide = (status: 'Paid' | 'Rejected') => {
    const trimmed = note.trim();

    if (status === 'Rejected' && trimmed.length === 0) {
      setNoteError('Add a note before rejecting this payout.');
      return;
    }

    setNoteError(null);
    onDecide(status, trimmed);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[var(--overlay-scrim)] p-5 backdrop-blur-xs">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="payout-process-title"
        className="max-h-[90vh] w-full max-w-[560px] overflow-auto rounded-[24px] border border-[var(--dialog-border)] bg-card p-7 shadow-2xl"
      >
        <div className="mb-3.5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold tracking-[0.12em] text-brand-sage uppercase">
              Process payout
            </p>
            <h2
              id="payout-process-title"
              className="mt-1.5 font-heading text-[22px] tracking-[-0.04em] text-foreground"
            >
              {payout.contributor}
            </h2>
          </div>
          <button
            type="button"
            className="text-[22px] leading-none text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Close payout panel"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="mb-3.5 flex flex-wrap gap-3.5 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">{payout.amount}</span>
          <span>·</span>
          <span>{payout.methodDetail}</span>
          <span>·</span>
          <span>Requested {payout.requested}</span>
        </div>

        <div className="mb-4 flex flex-wrap gap-2.5">
          <span className="rounded-full bg-surface-muted px-3 py-1.5 text-xs font-bold text-muted-foreground">
            {payout.status}
          </span>
        </div>

        <p className="mb-3.5 rounded-[14px] bg-surface-subtle p-4 text-sm leading-[1.7] text-foreground">
          Marking this payout as <strong>Paid</strong> records the disbursement
          and emits a ledger withdrawal entry. <strong>Reject</strong> returns
          the amount to the contributor&apos;s available balance.
        </p>

        <label
          className="mb-1.5 block text-xs font-bold text-foreground"
          htmlFor="payout-process-note"
        >
          Admin note
        </label>
        <textarea
          id="payout-process-note"
          value={note}
          onChange={(event) => {
            setNote(event.target.value);
            setNoteError(null);
          }}
          placeholder="Add a note (required when rejecting, optional when paying)"
          className="min-h-[70px] w-full rounded-xl border border-border bg-card text-foreground px-[13px] py-3 text-sm outline-none focus-visible:border-brand-sage-light"
        />
        {noteError ? (
          <p className="mt-2 text-xs text-destructive">{noteError}</p>
        ) : null}

        <div className="mt-[18px] flex flex-wrap justify-end gap-2.5">
          <button
            type="button"
            disabled={isDeciding}
            className="rounded-full border border-danger-subtle bg-card px-[18px] py-3 font-bold text-danger hover:bg-danger-subtle transition-colors disabled:opacity-60 cursor-pointer"
            onClick={() => handleDecide('Rejected')}
          >
            Reject
          </button>
          <button
            type="button"
            disabled={isDeciding}
            className="rounded-full bg-primary px-[18px] py-3 font-bold text-primary-foreground hover:bg-brand-forest transition-colors disabled:opacity-60 cursor-pointer"
            onClick={() => handleDecide('Paid')}
          >
            Mark as paid
          </button>
        </div>
      </div>
    </div>
  );
}