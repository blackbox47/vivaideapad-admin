import type {
  ApplicationDecisionBody,
  UserAccessStatusBody,
  UserRoleBody,
} from '@/models/users/users-model';

export type ApplicantStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Revision Requested'
  | 'Approved'
  | 'Rejected';

export type PlatformUserStatus = 'Active' | 'Invited' | 'Suspended';

export type PeopleTab = 'applicants' | 'invited' | 'rejected' | 'contributors';

export type ApplicantAiRisk = 'Low' | 'Medium' | 'High';

export interface ApplicantTopicDetail {
  title: string;
  brief?: string;
  rewardBudget?: string | number;
  closeDate?: string | null;
}

export interface Applicant {
  id: string;
  name: string;
  email: string;
  topic: string;
  title: string;
  body: string;
  submitted: string;
  status: ApplicantStatus;
  source?: string;
  consent?: boolean;
  decisionNotes?: string | null;
  referenceNumber?: string;
  risk?: ApplicantAiRisk;
  topicDetail?: ApplicantTopicDetail | null;
}

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  status: PlatformUserStatus;
  approved: number;
  balance: string;
  joined: string;
  hasLiveSubmission: boolean;
  invitedFrom: string;
}

export interface PeopleResponse {
  applicants: Applicant[];
  users: PlatformUser[];
}

export interface DecideApplicantBody {
  id: string;
  status: ApplicantStatus;
  comment?: string;
}

export interface ToggleUserBody {
  id: string;
  status: PlatformUserStatus;
}

/**
 * Re-exports from the spec-aligned `users` model so feature code can
 * import the canonical types directly from `@/models/people/people-model`.
 */
export type {
  ApplicationDecisionBody,
  UserAccessStatusBody,
  UserRoleBody,
};
