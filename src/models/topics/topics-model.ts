export type ConceptStatus = 'active' | 'draft' | 'scheduled' | 'archived';

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
