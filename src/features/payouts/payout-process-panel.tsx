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
    <div className="fixed inset-0 z-50 grid place-items-center bg-[rgba(8,23,18,0.6)] p-5">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="payout-process-title"
        className="max-h-[90vh] w-full max-w-[560px] overflow-auto rounded-[24px] bg-white p-7 shadow-[0_20px_60px_rgba(29,65,54,0.12)]"
      >
        <div className="mb-3.5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold tracking-[0.12em] text-[#527065] uppercase">
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
            className="text-[22px] leading-none text-foreground"
            aria-label="Close payout panel"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="mb-3.5 flex flex-wrap gap-3.5 text-xs text-[#687773]">
          <span className="font-semibold text-foreground">{payout.amount}</span>
          <span>·</span>
          <span>{payout.methodDetail}</span>
          <span>·</span>
          <span>Requested {payout.requested}</span>
        </div>

        <div className="mb-4 flex flex-wrap gap-2.5">
          <span className="rounded-full bg-[#eef1ef] px-3 py-1.5 text-xs font-bold text-[#687773]">
            {payout.status}
          </span>
        </div>

        <p className="mb-3.5 rounded-[14px] bg-[#f6f8f5] p-4 text-sm leading-[1.7] text-[#333]">
          Marking this payout as <strong>Paid</strong> records the disbursement
          and emits a ledger withdrawal entry. <strong>Reject</strong> returns
          the amount to the contributor&apos;s available balance.
        </p>

        <label
          className="mb-1.5 block text-xs font-bold"
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
          className="min-h-[70px] w-full rounded-xl border border-[#dfe7e3] px-[13px] py-3 text-sm outline-none focus-visible:border-[#70a28d]"
        />
        {noteError ? (
          <p className="mt-2 text-xs text-[#b3401f]">{noteError}</p>
        ) : null}

        <div className="mt-[18px] flex flex-wrap justify-end gap-2.5">
          <button
            type="button"
            disabled={isDeciding}
            className="rounded-full border border-[#ffe6d5] bg-white px-[18px] py-3 font-bold text-[#b3401f] disabled:opacity-60"
            onClick={() => handleDecide('Rejected')}
          >
            Reject
          </button>
          <button
            type="button"
            disabled={isDeciding}
            className="rounded-full bg-[#12231f] px-[18px] py-3 font-bold text-white hover:bg-[#254b40] disabled:opacity-60"
            onClick={() => handleDecide('Paid')}
          >
            Mark as paid
          </button>
        </div>
      </div>
    </div>
  );
}