export type CreatorRewardType = 'Reward' | 'Withdrawal' | 'Adjustment';

export type CreatorRewardStatus =
  | 'Available'
  | 'Pending'
  | 'Paid'
  | 'Recorded';

export interface CreatorRewardEntry {
  id: string;
  description: string;
  date: string;
  type: CreatorRewardType;
  amount: string;
  status: CreatorRewardStatus;
}

export interface CreatorRewardsOverview {
  available: string;
  pending: string;
  paidToDate: string;
  payoutMethod: string;
  entries: CreatorRewardEntry[];
}

export interface WithdrawRequestBody {
  amount: string;
  method: string;
  mobile?: string;
}

export interface WithdrawRequestResponse {
  requestedAt: string;
  entry: CreatorRewardEntry;
}
