import { useCallback } from 'react';

import type {
  ApplicantStatus,
  DecideApplicantBody,
  PeopleResponse,
} from '@/models/people/people-model';
import type { ApplicationDecisionBody } from '@/models/users/users-model';
import { useDecideApplicationMutation } from '@/services/applications/applications-service';
import {
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
  decideApplicant: (body: DecideApplicantBody) => {
    unwrap: () => Promise<unknown>;
  };
  toggleUserStatus: ReturnType<typeof useToggleUserStatusMutation>[0];
  isDeciding: boolean;
  isToggling: boolean;
}

function decisionFromStatus(
  status: ApplicantStatus,
): ApplicationDecisionBody['decision'] {
  if (status === 'Approved') return 'approve_invite';
  if (status === 'Rejected') return 'reject';
  return 'request_more_info';
}

export default function usePeople(): UsePeopleResult {
  const { data, isLoading, isError, error, refetch } = useGetPeopleQuery();
  const [decideApplication, { isLoading: isDeciding }] =
    useDecideApplicationMutation();
  const [toggleUserStatus, { isLoading: isToggling }] =
    useToggleUserStatusMutation();

  const decideApplicant = useCallback(
    (body: DecideApplicantBody) =>
      decideApplication({
        id: body.id,
        body: {
          decision: decisionFromStatus(body.status),
          notes: body.comment,
        },
      }),
    [decideApplication],
  );

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
