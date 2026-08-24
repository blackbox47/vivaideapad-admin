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
