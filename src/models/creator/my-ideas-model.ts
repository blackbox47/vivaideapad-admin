// Re-export for convenience so callers don't need to know which file owns it.
export type { IdeaStatus } from '@/models/creator/creator-dashboard-model';
import type { IdeaStatus } from '@/models/creator/creator-dashboard-model';

export interface MyIdea {
  id: string;
  title: string;
  conceptTitle?: string;
  topic: string;
  submitted: string;
  status: IdeaStatus;
  reward: string;
  comments: number;
  /** Short piece shown in the submission view modal. */
  body: string;
  /** Reviewer note; empty when none has been left. */
  feedback?: string;
}

export type MyIdeasStatusFilter = 'all' | IdeaStatus;

export interface MyIdeasQueryParams {
  status?: MyIdeasStatusFilter;
  search?: string;
}

export interface MyIdeasResponse {
  ideas: MyIdea[];
  total: number;
}
