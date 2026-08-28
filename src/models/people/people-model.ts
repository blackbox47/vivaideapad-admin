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

export type PeopleTab = 'applicants' | 'invited' | 'contributors';

export interface Applicant {
  id: string;
  name: string;
  email: string;
  topic: string;
  title: string;
  body: string;
  submitted: string;
  status: ApplicantStatus;
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
