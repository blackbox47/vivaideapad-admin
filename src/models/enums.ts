/**
 * Shared enum tuples + types from the REST spec (Module 5 + supporting).
 * Single source of truth — domain models import from here rather than
 * re-declaring literal unions.
 */

export const APPLICANT_STATUSES = [
  'Submitted',
  'Under Review',
  'Revision Requested',
  'Approved',
  'Rejected',
] as const;
export type ApplicantStatus = (typeof APPLICANT_STATUSES)[number];

export const SUBMISSION_STATUSES = [
  'Under Review',
  'Revision Requested',
  'Approved',
  'Published',
  'Rejected',
] as const;
export type SubmissionStatus = (typeof SUBMISSION_STATUSES)[number];

export const PAYOUT_STATUSES = [
  'Requested',
  'Under Review',
  'Approved',
  'Paid',
  'Rejected',
] as const;
export type PayoutStatus = (typeof PAYOUT_STATUSES)[number];

export const CONCEPT_STATUSES_SPEC = [
  'Draft',
  'Scheduled',
  'Active',
  'Archived',
] as const;
export type ConceptStatusSpec = (typeof CONCEPT_STATUSES_SPEC)[number];

export const LEDGER_ENTRY_TYPES = [
  'Reward',
  'Withdrawal',
  'Adjustment',
] as const;
export type LedgerEntryType = (typeof LEDGER_ENTRY_TYPES)[number];

export const LEDGER_ENTRY_STATUSES = [
  'Available',
  'Pending',
  'Paid',
  'Recorded',
  'Rejected',
  'On hold',
] as const;
export type LedgerEntryStatus = (typeof LEDGER_ENTRY_STATUSES)[number];

export const USER_ACCESS_STATUSES = [
  'Active',
  'Invited',
  'Suspended',
] as const;
export type UserAccessStatus = (typeof USER_ACCESS_STATUSES)[number];

export const NOTIFICATION_READ_STATES = ['unread', 'read'] as const;
export type NotificationReadState = (typeof NOTIFICATION_READ_STATES)[number];

export const RISK_LEVELS = ['Low', 'Medium', 'High'] as const;
export type RiskLevel = (typeof RISK_LEVELS)[number];

export const AUDIT_CATEGORIES_SPEC = [
  'Applicants',
  'Content',
  'Payouts',
  'System',
] as const;
export type AuditCategorySpec = (typeof AUDIT_CATEGORIES_SPEC)[number];
