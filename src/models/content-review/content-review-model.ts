export type AiRisk = 'Low' | 'Medium' | 'High';

export type SubmissionStatus =
  | 'Under Review'
  | 'Revision Requested'
  | 'Approved'
  | 'Published'
  | 'Rejected';

export type ReviewStatusFilter = 'all' | SubmissionStatus;

export interface ContentSubmission {
  id: string;
  title: string;
  contributor: string;
  topic: string;
  submitted: string;
  risk: AiRisk;
  status: SubmissionStatus;
  body: string;
  approvedCount: number;
  approvalRate: string;
}

export interface ReviewQueueResponse {
  submissions: ContentSubmission[];
}

export interface DecideSubmissionBody {
  id: string;
  status: SubmissionStatus;
  comment?: string;
}

// ── Spec-aligned additions (REST spec §5.5) ──────────────────────────────

export type SubmissionDecisionAction =
  | 'approve'
  | 'request_revision'
  | 'reject';

export interface SubmissionDecisionBody {
  decision: SubmissionDecisionAction;
  feedback?: string;
  /** Required when `decision === 'approve'`. */
  reward_amount?: number;
}

export interface SubmissionDecisionResponse {
  id: string;
  status: SubmissionStatus;
  feedback?: string;
  reward_amount?: number;
  decidedAt: string;
}

export interface RiskSignal {
  /** Originality score 0–100. */
  originalityScore: number;
  /** AI-likelihood score 0–100. */
  aiLikelihoodScore: number;
  risk: AiRisk;
  /** Free-text notes from the most recent scan. */
  notes?: string;
  scannedAt: string;
}

export interface SubmissionDetail extends ContentSubmission {
  version: number;
  feedback?: string;
  risk_signal?: RiskSignal;
  attachment_url?: string;
  submittedDate?: string;
  decidedDate?: string;
}

export interface RiskScanResponse {
  id: string;
  risk_signal: RiskSignal;
}

export interface PublishResponse {
  id: string;
  status: SubmissionStatus;
  publishedAt: string;
}
