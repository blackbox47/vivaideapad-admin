import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { Payout } from '@/models/payouts/payouts-model';

interface PayoutProcessPanelProps {
  payout: Payout;
  isDeciding: boolean;
  onClose: () => void;
  onDecide: (
    status: 'Paid' | 'Rejected',
    options?: { reference?: string; note?: string },
  ) => void;
}

export default function PayoutProcessPanel({
  payout,
  isDeciding,
  onClose,
  onDecide,
}: PayoutProcessPanelProps) {
  const [reference, setReference] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleDecide = (status: 'Paid' | 'Rejected') => {
    onDecide(status, {
      reference: reference.trim() || undefined,
      note: note.trim() || undefined,
    });
  };

  const amountText =
    payout.amount.startsWith('Tk') || payout.amount.startsWith('৳')
      ? payout.amount
      : `Tk ${payout.amount}`;

  const rawMethod = payout.methodDetail || payout.method;
  const methodText = rawMethod.toLowerCase().startsWith('method:')
    ? rawMethod
    : `Method: ${rawMethod}`;
  const requestedDate = (payout.requested || '').replace(/\./g, '-');
  const subtitle = requestedDate
    ? `${methodText} · Requested ${requestedDate}`
    : methodText;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="payout-process-title"
        className="w-full max-w-[480px] rounded-[24px] border border-border bg-card p-7 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold tracking-[0.12em] text-[#527065] uppercase dark:text-[#8cb3a3]">
              Process payout
            </p>
            <h2
              id="payout-process-title"
              className="mt-1 font-heading text-[22px] font-bold tracking-tight text-foreground"
            >
              {amountText} to {payout.contributor}
            </h2>
          </div>
          <button
            type="button"
            className="text-foreground/70 transition-colors hover:text-foreground cursor-pointer p-1 -mr-1 -mt-1"
            aria-label="Close payout modal"
            onClick={onClose}
          >
            <X className="size-5" />
          </button>
        </div>

        <p className="mt-2 text-[13px] text-muted-foreground">{subtitle}</p>

        <div className="mt-5">
          <label
            htmlFor="payout-reference"
            className="mb-1.5 block text-xs font-bold text-foreground"
          >
            Transaction reference
          </label>
          <input
            id="payout-reference"
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="e.g. TX93K2"
            disabled={isDeciding}
            className="h-11 w-full rounded-xl border border-input bg-card px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          />
        </div>

        <div className="mt-4">
          <label
            htmlFor="payout-notes"
            className="mb-1.5 block text-xs font-bold text-foreground"
          >
            Admin notes
          </label>
          <textarea
            id="payout-notes"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional"
            disabled={isDeciding}
            rows={3}
            className="min-h-[70px] w-full resize-y rounded-xl border border-input bg-card p-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          />
        </div>

        <div className="mt-5 flex flex-wrap justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            disabled={isDeciding}
            loading={isDeciding}
            className="h-auto rounded-full border border-[#ffe0cc] bg-card px-5 py-2.5 text-sm font-bold text-[#b3401f] transition-colors hover:bg-[#fff5ee] hover:text-[#9e3314] dark:border-orange-900/60 dark:text-orange-400 dark:hover:bg-orange-950/30 cursor-pointer"
            onClick={() => handleDecide('Rejected')}
          >
            Reject request
          </Button>
          <Button
            type="button"
            disabled={isDeciding}
            loading={isDeciding}
            className="h-auto rounded-full bg-[#12231f] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#1b342e] dark:bg-foreground dark:text-background dark:hover:bg-foreground/90 cursor-pointer"
            onClick={() => handleDecide('Paid')}
          >
            Mark as Paid
          </Button>
        </div>
      </div>
    </div>
  );
}