export const CONCEPT_STATUSES = [
  'draft',
  'scheduled',
  'active',
  'archived',
] as const;

export type ConceptStatus = (typeof CONCEPT_STATUSES)[number];

export const CATEGORY_ICON_CHOICES = [
  '✦',
  '✎',
  '⚑',
  '☾',
  '✺',
  '⚐',
  '◇',
  '★',
  '✿',
  '⬢',
] as const;

export interface ConceptCategory {
  name: string;
  icon: string;
}

export interface Concept {
  id: string;
  title: string;
  category: string;
  description: string;
  status: ConceptStatus;
  icon: string;
  opensOn: string;
  closesOn: string;
  reward: string;
}

export interface ConceptListParams {
  status?: ConceptStatus | 'all';
  search?: string;
}

export interface ConceptListResponse {
  concepts: Concept[];
  total: number;
}

export interface CreateConceptBody {
  title: string;
  category: string;
  icon: string;
  description: string;
  opensOn: string;
  closesOn: string;
  reward: string;
  status: ConceptStatus;
}

export interface CreateConceptResponse {
  concept: Concept;
  createdAt: string;
}
