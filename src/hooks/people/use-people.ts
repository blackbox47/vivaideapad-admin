import type { PeopleResponse } from '@/models/people/people-model';
import {
  useDecideApplicantMutation,
  useGetPeopleQuery,
  useToggleUserStatusMutation,
} from '@/services/people/people-service';
import { getApiErrorMessage } from '@/utils/helpers/api-error';

interface UsePeopleResult {
  data: PeopleResponse | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  refetch: () => void;
  decideApplicant: ReturnType<typeof useDecideApplicantMutation>[0];
  toggleUserStatus: ReturnType<typeof useToggleUserStatusMutation>[0];
  isDeciding: boolean;
  isToggling: boolean;
}

export default function usePeople(): UsePeopleResult {
  const { data, isLoading, isError, error, refetch } = useGetPeopleQuery();
  const [decideApplicant, { isLoading: isDeciding }] =
    useDecideApplicantMutation();
  const [toggleUserStatus, { isLoading: isToggling }] =
    useToggleUserStatusMutation();

  return {
    data: data ?? null,
    isLoading,
    isError,
    error: getApiErrorMessage(error),
    refetch,
    decideApplicant,
    toggleUserStatus,
    isDeciding,
    isToggling,
  };
}
