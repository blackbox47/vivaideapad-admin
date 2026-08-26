import type { WorkspaceAdmin } from '@/models/admins/admins-model';
import {
  useCreateWorkspaceAdminMutation,
  useGetWorkspaceAdminsQuery,
  useRemoveWorkspaceAdminMutation,
} from '@/services/admins/admins-service';
import { getApiErrorMessage } from '@/utils/helpers/api-error';

interface UseAdminsResult {
  admins: WorkspaceAdmin[];
  canManage: boolean;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  refetch: () => void;
  createAdmin: ReturnType<typeof useCreateWorkspaceAdminMutation>[0];
  removeAdmin: ReturnType<typeof useRemoveWorkspaceAdminMutation>[0];
  isCreating: boolean;
  isRemoving: boolean;
  createError: string | null;
  removeError: string | null;
  resetCreate: () => void;
  resetRemove: () => void;
}

export default function useAdmins(): UseAdminsResult {
  const { data, isLoading, isError, error, refetch } =
    useGetWorkspaceAdminsQuery();
  const [createAdmin, createState] = useCreateWorkspaceAdminMutation();
  const [removeAdmin, removeState] = useRemoveWorkspaceAdminMutation();

  return {
    admins: data?.admins ?? [],
    canManage: data?.canManage ?? false,
    isLoading,
    isError,
    error: getApiErrorMessage(error),
    refetch,
    createAdmin,
    removeAdmin,
    isCreating: createState.isLoading,
    isRemoving: removeState.isLoading,
    createError: getApiErrorMessage(createState.error),
    removeError: getApiErrorMessage(removeState.error),
    resetCreate: createState.reset,
    resetRemove: removeState.reset,
  };
}
