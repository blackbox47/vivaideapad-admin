import { useCallback } from 'react';

import type {
  UserAccessStatusBody,
  UserRoleBody,
} from '@/models/users/users-model';
import {
  useDeleteUserMutation,
  useUpdateUserAccessStatusMutation,
  useUpdateUserRoleMutation,
} from '@/services/users/users-service';
import { getApiErrorMessage } from '@/utils/helpers/api-error';

interface UseUserMutationsResult {
  updateAccessStatus: (
    id: string,
    body: UserAccessStatusBody,
  ) => Promise<boolean>;
  updateRole: (id: string, body: UserRoleBody) => Promise<boolean>;
  deleteUser: (id: string) => Promise<boolean>;
  isUpdatingAccessStatus: boolean;
  isUpdatingRole: boolean;
  isDeleting: boolean;
  error: string | null;
}

export default function useUserMutations(): UseUserMutationsResult {
  const [triggerAccess, accessState] = useUpdateUserAccessStatusMutation();
  const [triggerRole, roleState] = useUpdateUserRoleMutation();
  const [triggerDelete, deleteState] = useDeleteUserMutation();

  const updateAccessStatus = useCallback(
    async (id: string, body: UserAccessStatusBody) => {
      try {
        await triggerAccess({ id, body }).unwrap();
        return true;
      } catch {
        return false;
      }
    },
    [triggerAccess],
  );

  const updateRole = useCallback(
    async (id: string, body: UserRoleBody) => {
      try {
        await triggerRole({ id, body }).unwrap();
        return true;
      } catch {
        return false;
      }
    },
    [triggerRole],
  );

  const deleteUser = useCallback(
    async (id: string) => {
      try {
        await triggerDelete(id).unwrap();
        return true;
      } catch {
        return false;
      }
    },
    [triggerDelete],
  );

  return {
    updateAccessStatus,
    updateRole,
    deleteUser,
    isUpdatingAccessStatus: accessState.isLoading,
    isUpdatingRole: roleState.isLoading,
    isDeleting: deleteState.isLoading,
    error: getApiErrorMessage(
      accessState.error ?? roleState.error ?? deleteState.error,
    ),
  };
}