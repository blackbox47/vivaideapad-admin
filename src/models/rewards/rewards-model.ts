export type LedgerEntryType = 'Reward' | 'Withdrawal' | 'Adjustment';

export type LedgerEntryStatus =
  | 'Available'
  | 'Pending'
  | 'Paid'
  | 'Recorded'
  | 'Rejected'
  | 'On hold';

export type LedgerTypeFilter = 'all' | LedgerEntryType;

export interface LedgerEntry {
  id: string;
  contributor: string;
  description: string;
  /** Pre-formatted date string (DD-MM-YYYY) used by the table. */
  date: string;
  /** ISO timestamp used internally for sorting and aggregation. */
  occurredAt: string;
  type: LedgerEntryType;
  /** Signed amount string e.g. "+Tk 180" / "−Tk 240". */
  amount: string;
  /** Numeric amount (always positive); sign comes from the `type`. */
  amountValue: number;
  status: LedgerEntryStatus;
}

export interface LedgerListResponse {
  entries: LedgerEntry[];
  total: number;
}

export interface LedgerListParams {
  type?: LedgerTypeFilter;
  search?: string;
}
