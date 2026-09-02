import type { MyIdea } from '@/models/creator/my-ideas-model';

export const OPPORTUNITY_CATEGORIES = [
  'All',
  'Family occasions',
  'National days',
  'Cultural festivals',
  'Corporate wellbeing',
] as const;

export type OpportunityCategory = (typeof OPPORTUNITY_CATEGORIES)[number];

export type OpportunityCategoryFilter = OpportunityCategory;

export interface CreatorTopic {
  id: string;
  title: string;
  description: string;
  reward: string;
  /** Calendar close date shown on the submit-idea picker. */
  closesOn: string;
  category: Exclude<OpportunityCategory, 'All'>;
  icon: string;
  /** Remaining window shown on opportunity cards, e.g. "10 days". */
  deadline: string;
}

export interface CreatorTopicsResponse {
  topics: CreatorTopic[];
}

export interface SubmitIdeaBody {
  title: string;
  concept_id?: string;
  topicId?: string;
  summary?: string;
  body: string;
  attachmentUrl?: string;
  file?: File;
}

export interface SubmitIdeaResponse {
  idea: MyIdea;
  createdAt: string;
}

export interface SubmissionDetail {
  id: string;
  userId?: string;
  conceptId: string;
  conceptTitle?: string;
  title: string;
  summary?: string;
  body: string;
  attachmentUrl?: string;
  attachments?: Record<string, unknown> | null;
  status: string;
  rewardAmount?: string;
  decisionNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ValidationIssue {
  field: keyof SubmitIdeaBody | 'topicId' | 'concept_id';
  message: string;
}

export const TITLE_MAX = 80;
export const SUMMARY_MAX = 240;
export const BODY_MAX = 4000;
