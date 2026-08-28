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

export interface CreateAdjustmentBody {
  contributor: string;
  amount: string;
  reason: string;
}

export interface CreateAdjustmentResponse {
  entry: LedgerEntry;
  createdAt: string;
}

// ── Spec-aligned additions (REST spec §5.6 — global ledger search) ───────

export interface LedgerListParamsSpec
  extends Omit<LedgerListParams, 'type'> {
  type?: LedgerTypeFilter | 'all';
  userId?: string;
  status?: LedgerEntryStatus;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface ManualAdjustmentBody {
  user_id: string;
  amount: number;
  description: string;
  reason: string;
}

export interface ManualAdjustmentResponse {
  entry: LedgerEntry;
  createdAt: string;
}
