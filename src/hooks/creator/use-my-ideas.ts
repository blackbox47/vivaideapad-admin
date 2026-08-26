import type {
  MyIdeasQueryParams,
} from '@/models/creator/my-ideas-model';
import { useGetMyIdeasQuery } from '@/services/creator/my-ideas-service';

export default function useMyIdeas(params: MyIdeasQueryParams) {
  return useGetMyIdeasQuery(params);
}