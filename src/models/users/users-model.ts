import type {
  ApplicantStatus,
  PlatformUserStatus,
} from '@/models/people/people-model';
import type { PlatformRole } from '@/utils/helpers/platform-role';

export interface ApplicationDecisionBody {
  decision: 'approve_invite' | 'request_revision' | 'reject';
  message?: string;
}

export interface ApplicationDecisionResponse {
  id: string;
  status: ApplicantStatus;
  message?: string;
  decidedAt: string;
}

export interface UserAccessStatusBody {
  accessStatus: PlatformUserStatus;
  reason?: string;
}

export interface UserRoleBody {
  role: PlatformRole;
}

export interface UserDetail {
  id: string;
  name: string;
  email: string;
  status: PlatformUserStatus;
  approved: number;
  balance: string;
  joined: string;
  hasLiveSubmission: boolean;
  invitedFrom?: string;
  /** Recent activity items (lightweight — admin overview only). */
  recentActivity?: Array<{
    id: string;
    type: 'submission' | 'payout' | 'decision';
    description: string;
    at: string;
  }>;
}

export interface UserDeleteResponse {
  id: string;
  deletedAt: string;
}

export interface UserUpdateResponse {
  id: string;
  status: PlatformUserStatus;
  updatedAt: string;
}
