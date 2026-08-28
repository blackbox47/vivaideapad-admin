export type PayoutStatus =
  | 'Requested'
  | 'Under Review'
  | 'Approved'
  | 'Paid'
  | 'Rejected';

export type PayoutStatusFilter = 'all' | PayoutStatus;

export type PayoutMethod = 'bKash' | 'Nagad' | 'Rocket' | 'Bank';

export interface Payout {
  id: string;
  contributor: string;
  method: PayoutMethod;
  /** Display string e.g. "bKash · 018•••42". */
  methodDetail: string;
  /** Display string e.g. "Tk 240". */
  amount: string;
  /** Numeric amount (always positive). */
  amountValue: number;
  /** Pre-formatted date string (DD-MM-YYYY) used by the table. */
  requested: string;
  /** ISO timestamp used internally for sorting and aggregation. */
  requestedAt: string;
  status: PayoutStatus;
}

export interface PayoutListResponse {
  payouts: Payout[];
  total: number;
}

export interface PayoutListParams {
  status?: PayoutStatusFilter;
  search?: string;
}

export interface DecidePayoutBody {
  id: string;
  status: Extract<PayoutStatus, 'Paid' | 'Rejected'>;
  note?: string;
}

// ── Spec-aligned additions (REST spec §5.6) ──────────────────────────────

export interface PayoutListParamsSpec
  extends Omit<PayoutListParams, 'status'> {
  status?: PayoutStatusFilter | 'all';
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface PayoutDetail extends Payout {
  userId: string;
  walletBalance?: string;
  linkedLedgerEntryId?: string;
  processingReference?: string;
  rejectionReason?: string;
  decidedDate?: string;
}

export type PayoutProcessAction = 'mark_paid' | 'reject';

export interface ProcessPayoutBody {
  action: PayoutProcessAction;
  processing_reference?: string;
  rejection_reason?: string;
}

export interface ProcessPayoutResponse {
  id: string;
  status: PayoutStatus;
  processingReference?: string;
  rejectionReason?: string;
  decidedAt: string;
}
