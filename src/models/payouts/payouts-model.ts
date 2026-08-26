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
